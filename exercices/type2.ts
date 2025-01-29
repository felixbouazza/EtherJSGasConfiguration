import { ethers } from 'ethers';
import dotenv from "dotenv";

(async () => {

    dotenv.config()

    const url = `https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_ALCHEMY_API_KEY}`;
    const provider = new ethers.JsonRpcProvider(url);

    const signer = new ethers.Wallet(`${process.env.SEPOLIA_WALLET_PRIVATE_KEY}`, provider);

    const contractAddress = process.env.SEPOLIA_CONTRACT_ADDRESS
    const amountOfEther = ethers.parseUnits('0.000001', 'ether');

    const feeData = await provider.getFeeData();

    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * ethers.parseUnits('2', 'wei');
    const maxFeePerGas = feeData.maxFeePerGas - feeData.maxPriorityFeePerGas + maxPriorityFeePerGas

    const requestData = {
        nonce: await signer.getNonce(),
        to: contractAddress,
        value: amountOfEther,
        type: 2,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
	    maxFeePerGas: maxFeePerGas,
    }

    const estimateGasLimit = await signer.estimateGas(requestData);

    const tx = await signer.sendTransaction(
        {
            ...requestData,
            gasLimit: estimateGasLimit
        },
    );

    const receipt = await tx.wait();
    
    console.log(tx);
    console.log(receipt);
})();