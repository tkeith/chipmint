import { getWorker } from "../lib/bullmq";
import { getContractWithSigner } from "../lib/getContractWithSigner";
import getDb from "../lib/getDb";
import { getGasPrice } from "../lib/getGasPrice";
import { Recipient } from "../lib/models";
import { sendSms } from "../lib/sendSms";

getWorker('exampleSaveTextQueue', async job => {
  const newText = job.data.newText;
  console.log('saving new text: ', newText);
  (await getDb()).collection('example').updateOne(
    {},
    { $set: { text: newText } },
    { upsert: true, });
});

setInterval(() => {
  console.log('hello from worker')
}, 600000);

console.log('worker started')

getContractWithSigner().on("SmsRequested", async (smsRequestId: number, sender: string, recipient: string, time: number, text: string, newAuthQty: number) => {
  const recip = await (await getDb()).collection('recipients').findOne({address: recipient}) as Recipient

  await (await getDb()).collection('authorizations').updateOne({sender: sender, recipient: recipient}, {$set: {qty: newAuthQty}})

  let newStatus = 1; // success
  try {
    sendSms(recip.phoneNumber, text)
  } catch (err) {
    newStatus = 2; // failed
  }
  await (await getDb()).collection('smsRequests').insertOne({id: smsRequestId, sender: sender, recipient: recipient, time: time, text: text, status: newStatus})

  const tx = await (getContractWithSigner()).setSmsStatus(smsRequestId, newStatus, {
    gasPrice: getGasPrice() ?? 0 * 3,
  })
  console.log('setSmsStatus txn:', tx.hash)

});
