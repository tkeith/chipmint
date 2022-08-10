import exampleRoutes from './example-routes'
import { Router, Request, Response } from "express"
import * as gridfs from '../lib/gridfs'
import * as plivo from 'plivo'
import getConfig from '../lib/getConfig'
import * as yup from 'yup'
import randomNumericCode from '../lib/randomNumericCode'
import getRedis from '../lib/getRedis'
import getDb from '../lib/getDb'
import randomHexString from '../lib/randomHexString'
import { keccak256 } from 'ethers/lib/utils'
import curTimeSeconds from '../lib/curTimeSeconds'
import { getContractWithSigner } from '../lib/getContractWithSigner'
import { sendSms } from '../lib/sendSms'
import { Authorization } from '../lib/models'
import { getGasPrice } from '../lib/getGasPrice'
import dateFromSeconds from '../lib/dateFromSeconds'
import { strToBytes } from '../lib/strToBytes'
import { ethers } from 'ethers'
import { BigNumber } from 'ethers'

// catch async errors
// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
let wrap = (fn: any) => (...args: any[]) => fn(...args).catch(args[2])

const router = Router()
export default router

router.use('/examples', exampleRoutes)

router.route('/grid/public/:filename(*)').get(wrap(async (req: Request, res: Response) => {
  const gridFn = 'public/' + req.params.filename
  res.setHeader('content-type', (await gridfs.getMetadata(gridFn)).mime)
  ;(await gridfs.getGridFsBucket()).openDownloadStreamByName(gridFn).pipe(res)
}))

const GAS_PRICE = BigNumber.from('60000000000');

export const plivoClient = new plivo.Client(getConfig().server.plivo.auth_id, getConfig().server.plivo.auth_token)
export const plivoFromNumber = getConfig().server.plivo.from_number

const testMode = getConfig().public.test_mode

router.route('/requestOtp').post(wrap(async (req: Request, res: Response) => {
  console.log('req', req)
  console.log('req.body', JSON.stringify(req.body))
  console.log('req.body.phoneNumber', req.body.phoneNumber)
  const phoneNumber: string = await yup.string().required().validate(req.body.phoneNumber);

  const otp = randomNumericCode(6)

  console.log('SENDING OTP')

  await sendSms(phoneNumber, `${otp} is your Chipmint verification code`)
  
  console.log('SENT OPT')

  await (await getRedis()).set(`otpValid:${phoneNumber}:${otp}`, 1, {EX: 300})


  return res.json({'note': 'OTP sent'})
}))

async function isOtpValid(phoneNumber: string, otp: string): Promise<boolean> {
  return (testMode && otp == '123456') || (!!(await (await getRedis()).get(`otpValid:${phoneNumber}:${otp}`)))
}

function phoneNumberVerificationMessageToSign(phoneNumber: string) {
  return `Chipmint - verify phone number: ${phoneNumber}`
}

router.route('/checkOtp/:phoneNumber/:otp').get(wrap(async (req: Request, res: Response) => {
  const phoneNumber: string = await yup.string().required().validate(req.params.phoneNumber);
  const otp: string = await yup.string().required().validate(req.params.otp);

  const otpValid = await isOtpValid(phoneNumber, otp)

  return res.json({
    otpValid: otpValid,
    ...(otpValid ? {messageToSign: phoneNumberVerificationMessageToSign(phoneNumber)} : {})
  })
}))

async function verifyPhoneNumberOnChain(address: string, phoneHash: string) {
  const cws = getContractWithSigner()
  console.log('got contract with signer')
  console.log('verifying phone num for address: ', address, JSON.stringify(address))
  const tx = await cws.setPhoneNumberVerified(address, phoneHash, {
    gasPrice: GAS_PRICE,
  })
  console.log('verifyPhoneNumber txn:', tx.hash)
}

async function registerAuthorizationOnChain(sender: string, recipient: string, qty: number, exp: number) {
  const cws = getContractWithSigner()
  console.log('got contract with signer')
  const tx = await cws.registerAuthorization(sender, recipient, qty, exp, {
    gasPrice: GAS_PRICE,
  })
  console.log('registerAuthorization txn:', tx.hash)
}

function getPhoneHash(phoneNumber: string, nonce: string): string {
  const text = JSON.stringify([phoneNumber, nonce])
  const res = keccak256(strToBytes(text))
  return res
}

router.route('/registerVerification').post(wrap(async (req: Request, res: Response) => {
  const phoneNumber: string = await yup.string().required().validate(req.body.phoneNumber);
  const otp: string = await yup.string().required().validate(req.body.otp);
  const signature: string = await yup.string().required().validate(req.body.signature);

  const recipient = verifyMessage(phoneNumberVerificationMessageToSign(phoneNumber), signature)

  if (!isOtpValid(phoneNumber, otp)) {
    return res.status(403).json({error: 'OtpInvalid'})
  }

  await (await getRedis()).del(`otpValid:${phoneNumber}:${otp}`)

  const nonce = randomHexString(32)
  const phoneHash = getPhoneHash(phoneNumber, nonce)

  await (await getDb()).collection('recipients').updateOne({address: recipient}, {$set:{
    phoneNumber: phoneNumber,
    address: recipient,
    nonce: nonce,
    phoneHash: phoneHash
  }}, {upsert: true})

  console.log('verifying on chain:', phoneNumber, recipient)

  await verifyPhoneNumberOnChain(recipient, phoneHash)

  return res.json({'note': 'Phone number verified'})
}))

router.route('/isAddressVerified/:address').get(wrap(async (req: Request, res: Response) => {
  const address = (req.params.address as string).toLowerCase()

  const verified = !! await (await getDb()).collection('recipients').findOne({address: address})

  return res.json({
    verified: verified
  })
}))

router.route('/isAuthorized/:sender/:recipient').get(wrap(async (req: Request, res: Response) => {
  const sender = req.params.sender
  const recipient = (req.params.recipient as string).toLowerCase()

  const auth = await (await getDb()).collection('authorizations').findOne({sender: sender, recipient: recipient})

  const authorized = !!(auth && auth.qty > 0 && auth.exp > curTimeSeconds())

  let authPart = {}
  if (authorized) {
    authPart = {
      qty: auth.qty,
      exp: auth.exp
    }
  }

  return res.json({
    authorized: authorized,
    ...authPart
  })
}))

function getAuthMsg(sender: string, qty: number, exp: number) {
  const formattedDate = dateFromSeconds(exp).toISOString()
  return `Chipmint SMS authorization request\nNumber of messages: ${qty}\nExpiration: ${formattedDate}\nSender: ${sender}`
}

router.route('/getAuthorizationMessageToSign').get(wrap(async (req: Request, res: Response) => {
  const sender: string = (await yup.string().required().validate(req.query.sender)).toLowerCase();
  const qty: number = await yup.number().integer().required().validate(req.query.qty);
  const exp: number = await yup.number().integer().required().validate(req.query.exp);

  return res.json({
    message: getAuthMsg(sender, qty, exp)
  })
}))

function verifyMessage(msg: string, sig: string) {
  const prefix = 'valid_signature_for:'
  if (testMode && sig.startsWith(prefix)) {
    return sig.split(':')[1].toLowerCase()
  }
  return ethers.utils.verifyMessage(msg, sig).toLowerCase()
}

router.route('/registerAuthorization').post(wrap(async (req: Request, res: Response) => {
  const sender: string = (await yup.string().required().validate(req.body.sender)).toLowerCase();
  const qty: number = await yup.number().integer().required().validate(req.body.qty);
  const exp: number = await yup.number().integer().required().validate(req.body.exp);
  const signature: string = await yup.string().required().validate(req.body.signature);

  const recipient = verifyMessage(getAuthMsg(sender, qty, exp), signature)

  const curAuth: Authorization = await (await getDb()).collection('authorizations').findOne({sender: sender, recipient: recipient}) as Authorization
  if (curAuth && curAuth.qty > qty && curAuth.exp > exp) {
    return res.status(403).json({error: 'PreviousAuthorizationIsSuperior'})
  }

  const authUsedRes = await (await getDb()).collection('authorizationSignaturesUsed').updateOne({signature: signature}, {$set: {signature: signature}}, {upsert: true})
  console.log('upsert info')
  console.log(authUsedRes)
  console.log(authUsedRes.modifiedCount)
  if (!authUsedRes.upsertedCount) {
    return res.status(403).json({error: 'AuthorizationPreviouslyRegistered'})
  }

  await registerAuthorizationOnChain(sender, recipient, qty, exp);

  await (await getDb()).collection('authorizations').updateOne({sender: sender, recipient: recipient}, {$set: {sender: sender, recipient: recipient, qty: qty, exp: exp}}, {upsert: true})

  return res.json({note: 'Authorization registered'})
}))
