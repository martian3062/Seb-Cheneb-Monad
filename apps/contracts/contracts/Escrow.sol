// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Escrow
 * @dev Escrow and reward flow for bounties or ecosystem growth incentives.
 */
contract Escrow is Ownable {
    struct Bounty {
        address sponsor;
        uint256 amount;
        address resolver;
        bool resolved;
    }

    mapping(uint256 => Bounty) public bounties;
    uint256 public bountyCounter;

    event BountyCreated(uint256 indexed bountyId, address indexed sponsor, uint256 amount);
    event BountyResolved(uint256 indexed bountyId, address indexed resolver, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function createBounty() external payable {
        require(msg.value > 0, "Amount must be > 0");
        
        uint256 bountyId = bountyCounter++;
        bounties[bountyId] = Bounty({
            sponsor: msg.sender,
            amount: msg.value,
            resolver: address(0),
            resolved: false
        });
        
        emit BountyCreated(bountyId, msg.sender, msg.value);
    }

    // Assume centralized or owner-authorized resolver mapping for MVP
    function resolveBounty(uint256 _bountyId, address _resolver) external onlyOwner {
        Bounty storage bounty = bounties[_bountyId];
        require(!bounty.resolved, "Bounty already resolved");
        require(bounty.amount > 0, "Bounty does not exist");
        
        bounty.resolved = true;
        bounty.resolver = _resolver;
        
        (bool success, ) = _resolver.call{value: bounty.amount}("");
        require(success, "Transfer failed");
        
        emit BountyResolved(_bountyId, _resolver, bounty.amount);
    }
}
