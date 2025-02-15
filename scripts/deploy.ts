import hre, { ethers } from "hardhat";
import { OptimizedCompanyFundManager } from "../typechain-types";
import dotenv from "dotenv";
dotenv.config();


// Deploying OptimizedCompanyFundManager...
// Treasury Address: 0x02bae32275a4cD2623bcD9e032489AD32c93e275
// OptimizedCompanyFundManager deployed to: 0x40518219A9FC398FdD5d115D49998b2b2DB47780

// Deployment Details:
// --------------------
// Contract Address: 0x40518219A9FC398FdD5d115D49998b2b2DB47780
// Treasury Address: 0x02bae32275a4cD2623bcD9e032489AD32c93e275
// Network: sepolia
// Block Number: 7710199

async function main() {
  // Get the treasury address from environment variables
  const treasuryAddress = process.env.TREASURY_ADDRESS;
  if (!treasuryAddress) {
    throw new Error("Treasury address not found in environment variables");
  }

  console.log("Deploying OptimizedCompanyFundManager...");
  console.log("Treasury Address:", treasuryAddress);

  // Deploy the contract
  const CompanyFund = await ethers.getContractFactory(
    "OptimizedCompanyFundManager"
  );
  const companyFund = await CompanyFund.deploy(treasuryAddress);
  await companyFund.waitForDeployment();

  const address = await companyFund.getAddress();
  console.log("OptimizedCompanyFundManager deployed to:", address);

  // Verify contract
  if (process.env.ETHERSCAN_API) {
    console.log("Waiting for block confirmations...");
    const deployTx = companyFund.deploymentTransaction();
    if (deployTx) {
      await deployTx.wait(6); // Wait for 6 block confirmations
      await verifyContract(address, treasuryAddress);
      console.log("Contract verification completed");
    }
  }

  // Log deployment details
  console.log("\nDeployment Details:");
  console.log("--------------------");
  console.log("Contract Address:", address);
  console.log("Treasury Address:", treasuryAddress);
  console.log("Network:", hre.network.name);
  console.log("Block Number:", await ethers.provider.getBlockNumber());

  async function verifyContract(address: string, treasuryAddress: string) {
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [treasuryAddress],
      });
    } catch (error: any) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log("Contract is already verified!");
      } else {
        console.error("Error verifying contract:", error);
      }
    }
  }
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });