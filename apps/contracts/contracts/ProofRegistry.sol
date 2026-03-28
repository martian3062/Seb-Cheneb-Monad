// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ProofRegistry
 * @dev Registry for storing proof receipts of off-chain actions (like offline P2P sync).
 */
contract ProofRegistry {
    struct Proof {
        address submitter;
        bytes32 dataHash;
        string referenceUrl;
        uint256 timestamp;
    }

    mapping(bytes32 => Proof) public proofs;
    bytes32[] public allProofIds;

    event ProofRegistered(bytes32 indexed proofId, address indexed submitter, bytes32 dataHash);

    function registerProof(bytes32 _proofId, bytes32 _dataHash, string calldata _referenceUrl) external {
        require(proofs[_proofId].timestamp == 0, "Proof ID already exists");

        proofs[_proofId] = Proof({
            submitter: msg.sender,
            dataHash: _dataHash,
            referenceUrl: _referenceUrl,
            timestamp: block.timestamp
        });
        
        allProofIds.push(_proofId);
        emit ProofRegistered(_proofId, msg.sender, _dataHash);
    }
    
    function getProof(bytes32 _proofId) external view returns (Proof memory) {
        return proofs[_proofId];
    }
}
