import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Attack", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function fixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2, badUser] = await ethers.getSigners();

    //I deploy MyEtherWallet contract
    const myEtherWallet_ = await ethers.getContractFactory("MyEtherWallet4");
    const myEtherWallet = await myEtherWallet_.deploy();

    //bad user deploy the attacker contract
    const attacker_ = await ethers.getContractFactory("Attacker4");
    const attacker = await attacker_
      .connect(badUser)
      .deploy(await myEtherWallet.getAddress());

    return { myEtherWallet, attacker, owner, user1, user2, badUser };
  }

  describe("Prevention by using openzeppelin", function () {
    it("Should revert", async function () {
      const { myEtherWallet, attacker, user1, badUser } = await loadFixture(
        fixture
      );

      expect(
        await ethers.provider.getBalance(myEtherWallet.getAddress())
      ).to.equal("0");

      //user1 and user2 deposit 2 and 3 eth respectively
      await user1.sendTransaction({
        to: myEtherWallet.getAddress(),
        value: ethers.parseEther("2"),
      });
      await user1.sendTransaction({
        to: myEtherWallet.getAddress(),
        value: ethers.parseEther("3"),
      });

      //now, wallet should have 5 eth
      expect(
        await ethers.provider.getBalance(myEtherWallet.getAddress())
      ).to.eq(ethers.parseEther("5").toString());

      /*bad user wants to steal 1 eth.
      and save it in the Attacker contract
      */

      //before that, the Attacker contract does not have any eth
      expect(await ethers.provider.getBalance(attacker.getAddress())).to.eq(
        ethers.parseEther("0").toString()
      );

      //after that, the Attacker contract has 2 eth
      await expect(
        attacker
          .connect(badUser)
          .stealFromWallet({ value: ethers.parseEther("1") })
      ).to.revertedWith("Failed to send Ether");
    });
  });
});
