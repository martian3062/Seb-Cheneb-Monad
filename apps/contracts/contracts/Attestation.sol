// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Attestation
 * @dev Basic attestation registry for verifying user/agent actions.
 */
contract Attestation {
    struct AttestationRecord {
        address issuer;
        address subject;
        bytes32 schemaId;
        bytes data;
        uint256 timestamp;
        bool revoked;
    }

    mapping(bytes32 => AttestationRecord) public attestations;
    
    event Attested(bytes32 indexed attestationId, address indexed issuer, address indexed subject, bytes32 schemaId);
    event Revoked(bytes32 indexed attestationId, address indexed issuer);

    function attest(bytes32 _attestationId, address _subject, bytes32 _schemaId, bytes calldata _data) external {
        require(attestations[_attestationId].timestamp == 0, "Attestation ID exists");
        
        attestations[_attestationId] = AttestationRecord({
            issuer: msg.sender,
            subject: _subject,
            schemaId: _schemaId,
            data: _data,
            timestamp: block.timestamp,
            revoked: false
        });
        
        emit Attested(_attestationId, msg.sender, _subject, _schemaId);
    }

    function revoke(bytes32 _attestationId) external {
        AttestationRecord storage record = attestations[_attestationId];
        require(record.issuer == msg.sender, "Only issuer can revoke");
        require(!record.revoked, "Already revoked");
        
        record.revoked = true;
        emit Revoked(_attestationId, msg.sender);
    }
}
