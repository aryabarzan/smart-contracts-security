// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "./My.sol";

contract Other {
    My public myContract;
    
    constructor(My myContract_) {
        myContract = myContract_;
    }

    function g() public {
        myContract.f();
    }
}
