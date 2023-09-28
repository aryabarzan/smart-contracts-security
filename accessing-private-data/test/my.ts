import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers as hardhatEthers } from "hardhat";
import { ethers } from "ethers";

describe("Attack", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function fixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await hardhatEthers.getSigners();

    //Deploy My contract
    const my_ = await hardhatEthers.getContractFactory("My");
    const my = await my_.deploy();

    return { my };
  }

  describe("Reading private data", function () {
    it("Data at storage 0 should be read correctly", async function () {
      const { my } = await loadFixture(fixture);

      const abiCoder = new hardhatEthers.AbiCoder();

      const yxb = await hardhatEthers.provider.getStorage(my.getAddress(), 0);

      let b_ = ethers.dataSlice(yxb, 31);
      let x_ = ethers.dataSlice(yxb, 30, 31);
      let y_ = ethers.dataSlice(yxb, 0, 30);

      b_ = ethers.zeroPadValue(b_, 32);
      x_ = ethers.zeroPadValue(x_, 32);
      y_ = ethers.zeroPadValue(y_, 32);

      const b = abiCoder.decode(["bool"], b_);
      const x = abiCoder.decode(["uint8"], x_);
      const y = abiCoder.decode(["uint16"], y_);

      expect(b.toString()).to.be.equal("true");
      expect(x.toString()).to.be.equal("5");
      expect(y.toString()).to.be.equal("20");
    });

    it("Data at storage 1 should be read correctly", async function () {
      const { my } = await loadFixture(fixture);

      const abiCoder = new hardhatEthers.AbiCoder();

      const z_ = await hardhatEthers.provider.getStorage(my.getAddress(), 1);
      const z = abiCoder.decode(["uint256"], z_);

      expect(z.toString()).to.be.equal("128");
    });
  });
});
