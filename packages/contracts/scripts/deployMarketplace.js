const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance));

  if (balance === 0n) {
    console.error("❌ Error: Insufficient funds. Please get test tokens from the Tempo Faucet for address:", deployer.address);
    process.exit(1);
  }

  const marketplace = await hre.ethers.deployContract("Marketplace");

  await marketplace.waitForDeployment();

  console.log(`Marketplace contract deployed to: ${marketplace.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});