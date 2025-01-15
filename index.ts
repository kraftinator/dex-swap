import { swap } from './uniswap/swap'
import { promisify } from 'util'
import { initializeWallet } from './dexWallet';

const main = promisify(async () => {
    const dexWallet = await initializeWallet(`https://base-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`)
    const swapResult = await swap(
        dexWallet,
        [
          '0x4200000000000000000000000000000000000006',  // WETH
          '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // USDC  
        ]
    )
  });

main().then(() => {
    console.log('Async operation completed')
});