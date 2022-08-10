import { getProvider } from "./getProvider";

export async function getGasPrice() {
  return (await getProvider().getFeeData()).gasPrice;
}
