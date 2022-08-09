import { ethers } from 'ethers';


export function getProvider() {
  return new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
}
