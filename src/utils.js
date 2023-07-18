// Import some libraries
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import QRCode from 'qrcode';

// Create an IPFS client instance
const ipfs = create();

// Define a function that connects to the blockchain using Metamask
export async function connectBlockchain() {
  // Check if Metamask is installed
  if (window.ethereum) {
    // Request access to the user's accounts
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    // Create a provider instance
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Get the signer instance
    const signer = provider.getSigner();
    // Return the provider and signer
    return { provider, signer };
  } else {
    // Throw an error if Metamask is not installed
    throw new Error('Metamask is not installed');
  }
}

// Define a function that uploads a file to IPFS and returns the hash
export async function uploadToIPFS(file) {
  try {
    // Add the file to IPFS and get the result
    const result = await ipfs.add(file);
    // Return the IPFS hash
    return result.path;
  } catch (error) {
    // Throw an error if IPFS upload fails
    throw new Error('IPFS upload failed');
  }
}

// Define a function that generates a QR code for a given text and returns the data URL
export async function generateQRCode(text) {
  try {
    // Generate the QR code and get the data URL
    const dataURL = await QRCode.toDataURL(text);
    // Return the data URL
    return dataURL;
  } catch (error) {
    // Throw an error if QR code generation fails
    throw new Error('QR code generation failed');
  }
}
