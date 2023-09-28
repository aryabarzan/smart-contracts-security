// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract My {
    //These are stored in the slot0
    bool private b;
    uint8 private x;
    uint16 private y;

    //it is stored in slot 1
    uint256 private z;

    constructor() {
        b = true;
        x = 5;
        y = 20;
        z = 128;
    }
}
