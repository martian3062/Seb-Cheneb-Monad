import { expect } from "chai";
import { ethers } from "hardhat";

describe("Builder Base Contracts", function () {
  let proofRegistry: any;
  let attestation: any;
  let escrow: any;
  let agentBilling: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  before(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ProofRegistry = await ethers.getContractFactory("ProofRegistry");
    proofRegistry = await ProofRegistry.deploy();

    const Attestation = await ethers.getContractFactory("Attestation");
    attestation = await Attestation.deploy();

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();

    const AgentBilling = await ethers.getContractFactory("AgentBilling");
    agentBilling = await AgentBilling.deploy();
  });

  describe("ProofRegistry", function () {
    it("Should register a proof", async function () {
      const proofId = ethers.id("proof1");
      const dataHash = ethers.id("data1");
      await proofRegistry.connect(addr1).registerProof(proofId, dataHash, "ipfs://mock1");
      
      const proof = await proofRegistry.getProof(proofId);
      expect(proof.submitter).to.equal(addr1.address);
      expect(proof.dataHash).to.equal(dataHash);
    });
  });

  describe("Attestation", function () {
    it("Should create an attestation", async function () {
      const attId = ethers.id("att1");
      const schemaId = ethers.id("schema1");
      const data = ethers.toUtf8Bytes("Mock Attestation Data");
      
      await attestation.connect(owner).attest(attId, addr1.address, schemaId, data);
      
      const record = await attestation.attestations(attId);
      expect(record.issuer).to.equal(owner.address);
      expect(record.subject).to.equal(addr1.address);
    });
  });

  describe("AgentBilling", function () {
    it("Should allow deposit and billing", async function () {
      const depositAmount = ethers.parseEther("1.0");
      const billAmount = ethers.parseEther("0.1");

      await agentBilling.connect(addr1).depositForAgents({ value: depositAmount });
      
      let deposit = await agentBilling.userDeposits(addr1.address);
      expect(deposit).to.equal(depositAmount);

      await agentBilling.connect(addr2).billUser(addr1.address, billAmount, "Agent task executed");
      
      deposit = await agentBilling.userDeposits(addr1.address);
      expect(deposit).to.equal(depositAmount - billAmount);

      const agentBalance = await agentBilling.agentBalances(addr2.address);
      expect(agentBalance).to.equal(billAmount);
    });
  });
});
