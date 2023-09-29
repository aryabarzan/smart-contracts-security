// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "./Other.sol";

contract My {
    uint256 public i = 0;
    Other public otherContract;

    function setOtherContract(Other otherContract_) public {
        otherContract = otherContract_;
    }

    function f() public {
        ++i;
        otherContract.g();
    }
}
