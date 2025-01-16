import { Contract } from 'ethers'
import { DexWallet } from '../dexWallet'
import { callContractMethod } from '../contractUtils'

import erc20Abi from './contracts/ERC20.json'
import swapRouterAbi from './contracts/SwapRouter.json'

export async function swap(dexWallet: DexWallet, amountIn: Number, pair: [string, string], reverse?: boolean) {

  const {
      wallet,
      walletAddress,
      walletBalance,
      providerGasPrice
  } = dexWallet

  console.log(walletAddress + ':', walletBalance)

  const tokenAAddress = reverse ? pair[1] : pair[0]
  const tokenBAddress = reverse ? pair[0] : pair[1]
  const tokenAContract = new Contract(tokenAAddress, erc20Abi, wallet)
  const tokenBContract = new Contract(tokenBAddress, erc20Abi, wallet)

  const tokenABalance: bigint = await tokenAContract.balanceOf(walletAddress);
  const tokenBBalance: bigint = await tokenBContract.balanceOf(walletAddress)
  
  console.log('Token A', tokenABalance, 'Token B:', tokenBBalance)

  const swapRouterAddress = '0x2626664c2603336E57B271c5C0b26F421741e481' // Base
  const swapRouterContract = new Contract(swapRouterAddress, swapRouterAbi, wallet)
  
  console.log('Provider gas price:', providerGasPrice)
  const gasPrice: bigint = (providerGasPrice * 12n) / 10n;
  console.log('Actual gas price:', gasPrice)
  
  const allowance: bigint = await tokenAContract.allowance(walletAddress, swapRouterAddress)
  console.log('Token A spenditure allowance:', allowance)

  if (allowance < tokenABalance) {
      await callContractMethod(tokenAContract, 'approve', [swapRouterAddress, tokenABalance], gasPrice)
      console.log(`Spending of ${tokenABalance} approved.`)
  }

  const swapDeadline = Math.floor((Date.now() / 1000) + (60 * 60))
  const swapTxInputs = {
    tokenIn: tokenAAddress,
    tokenOut: tokenBAddress,
    fee: 3000, // Fee tier
    recipient: walletAddress,
    deadline: BigInt(swapDeadline), // Deadline as bigint
    //amountIn: tokenABalance, // Token A balance
    amountIn: amountIn,
    amountOutMinimum: 0n, // Minimum acceptable amount of token B
    sqrtPriceLimitX96: 0n // No price limit
  };

  console.log("Swap Transaction Inputs:", swapTxInputs);

  const swapTxResponse = await callContractMethod(
      swapRouterContract,
      'exactInputSingle',
      [swapTxInputs], // Pass as an array with one tuple
      gasPrice
  );

  return swapTxResponse

}