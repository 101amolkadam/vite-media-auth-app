// import pkg from 'hardhat';
// const { ethers } = pkg;

// eslint-disable-next-line no-undef
const { ethers } = require('ethers');

async function main() {
  // Get the contract factory
  const MediaAuth = await ethers.getContractFactory("MediaAuth");
  // Deploy the contract
  const mediaAuth = await MediaAuth.deploy();
  // Wait for the contract to be deployed
  await mediaAuth.deployed();
  // Log the contract address
  console.log("Contract deployed to address:", mediaAuth.address);
}

main()
  // eslint-disable-next-line no-undef
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  });
