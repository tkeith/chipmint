import { plivoClient, plivoFromNumber } from '../express/routes';

export async function sendSms(phoneNumber: string, text: string) {
  if (phoneNumber.endsWith('9999')) {
    return // test number, do not really send
  }
  console.log(await plivoClient.messages.create(plivoFromNumber, '1' + phoneNumber, text))
}
