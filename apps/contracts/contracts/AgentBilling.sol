// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AgentBilling
 * @dev Micropayment tracking for semi-autonomous agents executions.
 */
contract AgentBilling {
    mapping(address => uint256) public agentBalances;
    mapping(address => uint256) public userDeposits;

    event Deposit(address indexed user, uint256 amount);
    event Billed(address indexed agent, address indexed user, uint256 amount, string reason);
    event Withdrawn(address indexed agent, uint256 amount);

    // Users deposit Monad/ETH for agents to consume
    function depositForAgents() external payable {
        require(msg.value > 0, "Must deposit > 0");
        userDeposits[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Agent bills a user for services (Requires user approval/signature in a real scenario, MVP allows agent direct billing)
    function billUser(address _user, uint256 _amount, string calldata _reason) external {
        require(userDeposits[_user] >= _amount, "Insufficient user deposit");
        
        userDeposits[_user] -= _amount;
        agentBalances[msg.sender] += _amount;
        
        emit Billed(msg.sender, _user, _amount, _reason);
    }

    // Agents can withdraw their earned balances
    function withdraw() external {
        uint256 balance = agentBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        agentBalances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdraw failed");
        
        emit Withdrawn(msg.sender, balance);
    }
}
