import { Contract } from 'ethers';

export async function callContractMethod(
    contract: Contract,
    method: string,
    inputs: any[],
    gasPrice: bigint
) {
    console.log('INPUTS:')
    console.log(`${method}(${inputs})`);

    // The default gas limit will be used if gas estimation fails
    let gasLimit = 500000n; // Default gas limit as `bigint`

    try {
        // Use type assertion to access the method dynamically
        const gasEstimate = await (contract.estimateGas as any)[method](...inputs); // Returns `bigint`

        // Double the estimate to make sure the limit is high enough
        gasLimit = gasEstimate * 2n;
        console.log('Gas estimate:', gasEstimate);
        console.log('Gas limit:', gasLimit);
    } catch (error) {
        console.log('Default gas limit:', gasLimit);
    }

    /**
     * Send the transaction to the contract with gasPrice and gasLimit parameters
     * to ensure the successful completion of the transaction.
     */
    //console.log('***** FLAG A *****')
    //console.log("Method ABI:", contract.interface.getFunction(method));
    const txResponse = await (contract as any)[method](...inputs, { gasPrice, gasLimit });
    //console.log('***** FLAG B *****')
    console.log('Done! Tx Hash:', txResponse.hash);
    return txResponse;
}
