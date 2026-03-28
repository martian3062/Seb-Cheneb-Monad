import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ProofRegistry
  const ProofRegistry = await ethers.getContractFactory("ProofRegistry");
  const proofRegistry = await ProofRegistry.deploy();
  await proofRegistry.waitForDeployment();
  console.log("ProofRegistry deployed to:", await proofRegistry.getAddress());

  // Deploy Attestation
  const Attestation = await ethers.getContractFactory("Attestation");
  const attestation = await Attestation.deploy();
  await attestation.waitForDeployment();
  console.log("Attestation deployed to:", await attestation.getAddress());

  // Deploy Escrow
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();
  await escrow.waitForDeployment();
  console.log("Escrow deployed to:", await escrow.getAddress());

  // Deploy AgentBilling
  const AgentBilling = await ethers.getContractFactory("AgentBilling");
  const agentBilling = await AgentBilling.deploy();
  await agentBilling.waitForDeployment();
  console.log("AgentBilling deployed to:", await agentBilling.getAddress());

  // Save the addresses to a JSON file for the frontend
  const fs = require("fs");
  const contractsDir = __dirname + "/../deployments";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-addresses.json",
    JSON.stringify({
      ProofRegistry: await proofRegistry.getAddress(),
      Attestation: await attestation.getAddress(),
      Escrow: await escrow.getAddress(),
      AgentBilling: await agentBilling.getAddress()
    }, undefined, 2)
  );
  console.log("Contract addresses saved to apps/contracts/deployments/contract-addresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
