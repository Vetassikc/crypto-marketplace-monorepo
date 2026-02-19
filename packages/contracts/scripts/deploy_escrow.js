const hre = require("hardhat");

async function main() {
  const AUSD_ADDRESS = "0x20c0000000000000000000000000000000000001"; // AlphaUSD on Tempo Moderato
  
  console.log(`Deploying Escrow contract with Payment Token: ${AUSD_ADDRESS}`);

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(AUSD_ADDRESS);

  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log(`Escrow deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
