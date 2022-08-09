import { plivoClient, plivoFromNumber } from '../express/routes';

export async function sendSms(phoneNumber: string, text: string) {
  await plivoClient.messages.create(plivoFromNumber, phoneNumber, text);
}
