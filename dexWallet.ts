import { ethers } from 'ethers';

export interface DexWallet {
    wallet: ethers.Wallet;
    walletAddress: string;
    walletBalance: bigint; // Use `bigint` for balances
    providerGasPrice: bigint; // Use `bigint` for gas prices
}

export const initializeWallet = async (network?: string): Promise<DexWallet> => {
    const { PRIVATE_KEY } = process.env;

    if (!PRIVATE_KEY) {
        throw new Error('Private key missing from environment variables.');
    }

    // Create a provider
    const provider = network
        ? new ethers.JsonRpcProvider(network) // Connect to the user-provided network
        : ethers.getDefaultProvider(); // Connect to Ethereum mainnet

    // Create a wallet instance
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Get wallet address and balance
    const walletAddress = wallet.address; // Address is a string in ethers v6
    const walletBalance = await provider.getBalance(walletAddress); // Returns `bigint`

    // Get the current gas price
    const feeData = await provider.getFeeData();
    const providerGasPrice = feeData.gasPrice ?? BigInt(0); // Handle cases where `gasPrice` is null

    return {
        wallet,
        walletAddress,
        walletBalance,
        providerGasPrice,
    };
};

(async () => {
  try {
      const dexWallet = await initializeWallet(`https://base-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
      console.log("Wallet Address:", dexWallet.walletAddress);
      console.log("Wallet Balance (ETH):", ethers.formatEther(dexWallet.walletBalance));
      console.log("Gas Price (GWEI):", ethers.formatUnits(dexWallet.providerGasPrice, "gwei"));
  } catch (error) {
      console.error("Error initializing wallet:", error);
  }
})();
