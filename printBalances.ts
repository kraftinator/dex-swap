import { ethers } from 'ethers'
import { Contract } from 'ethers'
import erc20Abi from './uniswap/contracts/ERC20.json'

export async function printBalances() {

    const { PRIVATE_KEY } = process.env
    const { INFURA_API_KEY } = process.env

    if (!PRIVATE_KEY) {
        console.log('Private key missing from env variables')
        return
    }
    
    const RPC_URL = `https://base-mainnet.infura.io/v3/${INFURA_API_KEY}`;
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const walletAddress = await wallet.getAddress()
    const walletBalance = await provider.getBalance(walletAddress); // Returns `bigint`
    console.log(walletAddress + ':', walletBalance)

    const tokenAAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // USDC
    //const tokenAAddress = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' // DEGEN
    const tokenBAddress = '0x4200000000000000000000000000000000000006' // WETH

    const tokenAContract = new Contract(tokenAAddress, erc20Abi, wallet)
    const tokenBContract = new Contract(tokenBAddress, erc20Abi, wallet)
  
    const tokenABalance: bigint = await tokenAContract.balanceOf(walletAddress)
    const tokenBBalance: bigint = await tokenBContract.balanceOf(walletAddress)

    console.log('ETH: ', walletBalance)
    console.log('Token A: ', tokenABalance)
    console.log('Token B: ', tokenBBalance)

}

(async () => {
  await printBalances();
})();