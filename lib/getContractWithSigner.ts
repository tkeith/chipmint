import getConfig from '../lib/getConfig';
import { ethers } from 'ethers';
import { getProvider } from './getProvider';
import { getGasPrice } from './getGasPrice';

export function getContractWithSigner() {
  const contractAddr = getConfig().public.contract_deployments.matic.MainContract.address;
  const contractAbi = getConfig().public.contract_deployments.matic.MainContract.abi;

  console.log('interacting w/ contract:', contractAddr);

  let privateKey = getConfig().server.manager_wallet_private_key;
  let wallet = new ethers.Wallet(privateKey, getProvider());

  console.log('pkey: ', privateKey);

  const contractWithSigner = new ethers.Contract(contractAddr, contractAbi, wallet);

  return contractWithSigner;
}
