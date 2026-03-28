// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC7231 Identity Aggregator (Simplified Base)
 * @dev A CARV-inspired standard for tying off-chain attestations to on-chain DIDs. 
 */
contract ERC7231IdentityAggregator {
    // Map an address to an array of attested identity hashes/payloads
    mapping(address => bytes32[]) private identities;

    event IdentityBound(address indexed account, bytes32 indexed identityHash);
    event IdentityRevoked(address indexed account, bytes32 indexed identityHash);

    /**
     * @dev Bind a new off-chain verified identity to your wallet DID
     */
    function bindIdentity(bytes32 identityHash) external {
        identities[msg.sender].push(identityHash);
        emit IdentityBound(msg.sender, identityHash);
    }

    /**
     * @dev Get all identities bound to an account
     */
    function getIdentities(address account) external view returns (bytes32[] memory) {
        return identities[account];
    }
}
