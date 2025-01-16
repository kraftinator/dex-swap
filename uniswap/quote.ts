import { ethers } from 'ethers'
import uniswapV3FactoryAbi from './contracts/UniswapV3Factory.json'
import uniswapV3PoolAbi from './contracts/UniswapV3Pool.json'

export async function quotePair() {

    const uniswapV3FactoryAddress = '0x33128a8fC17869897dcE68Ed026d694621f6FDfD'

    const { PRIVATE_KEY } = process.env
    const { INFURA_API_KEY } = process.env

    if (!PRIVATE_KEY) {
        console.log('Private key missing from env variables')
        return
    }
    
    const RPC_URL = `https://base-mainnet.infura.io/v3/${INFURA_API_KEY}`;
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const factoryContract = new ethers.Contract(uniswapV3FactoryAddress, uniswapV3FactoryAbi, wallet)

    const walletAddress = await wallet.getAddress()
    const walletBalance = await provider.getBalance(walletAddress); // Returns `bigint`
    console.log(walletAddress + ':', walletBalance)

    const tokenAAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // USDC
    //const tokenAAddress = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' // DEGEN
    const tokenBAddress = '0x4200000000000000000000000000000000000006' // WETH

    const txInputs = [
        tokenAAddress,
        tokenBAddress,
        3000
    ]

    const poolAddress = await factoryContract.getPool(...txInputs)
    console.log('Pool address:', poolAddress)

    const poolContract = new ethers.Contract(poolAddress, uniswapV3PoolAbi, wallet)
    const slot0 = await poolContract.slot0()
    
    const { tick } = slot0

    let decimal1 = 6;
    let decimal2 = 18;

    const tokenBPrice = (1.0001**Number(tick))/(10**(decimal1-decimal2))

    console.log('slot0', slot0)
    console.log('Number(tick)', Number(tick))
    
    console.log('Tick:', tick, 'Price:', tokenBPrice)

    return tokenBPrice

}

(async () => {
  await quotePair();
})();