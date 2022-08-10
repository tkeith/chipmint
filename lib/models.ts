import { ObjectId } from 'mongodb';

export type Recipient = {
  _id: ObjectId;
  phoneNumber: string;
  address: string;
  nonce: string;
  phoneHash: string;
};
export type Authorization = {
  _id: ObjectId;
  sender: string;
  recipient: string;
  qty: number;
  exp: number;
};
