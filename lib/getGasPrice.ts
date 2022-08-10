import { getProvider } from "./getProvider";

export async function getGasPrice() {
  const res = (await getProvider().getFeeData()).gasPrice;
  console.log('gasPrice: ', res)
  return res
}
