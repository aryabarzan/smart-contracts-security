// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";

contract MyEtherWallet {
    mapping(address => uint) public balances;

    receive() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawAll() external {
        uint balance_ = balances[msg.sender];
        require(balance_ <= address(this).balance);

        (bool sent, ) = payable(msg.sender).call{value: balance_}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }
}
