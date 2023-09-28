import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Reentrance scenario", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function fixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherUser] = await ethers.getSigners();

    //I deploy MyEtherWallet contract
    const my_ = await ethers.getContractFactory("My");
    const my = await my_.deploy();

    //bad user deploy the attacker contract
    const other_ = await ethers.getContractFactory("Other");
    const other = await other_.connect(otherUser).deploy(await my.getAddress());

    my.setOtherContract(other);

    return { my, other, owner, otherUser };
  }

  it("Should be reverted", async function () {
    const { my, other, owner, otherUser } = await loadFixture(fixture);

    await expect(my.f()).to.be.revertedWithoutReason();
  });
});
