const { expect } = require("chai")
const { ethers } = require("hardhat")
const { time } = require("@nomicfoundation/hardhat-network-helpers")

describe("ShardTip", () => {
  let shardTip
  let owner
  let creator
  let tipper
  let otherAccount

  beforeEach(async () => {
    ;[owner, creator, tipper, otherAccount] = await ethers.getSigners()

    const ShardTip = await ethers.getContractFactory("ShardTip")
    shardTip = await ShardTip.deploy()
    await shardTip.waitForDeployment()
  })

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await shardTip.owner()).to.equal(owner.address)
    })

    it("Should set initial platform fee to 2.5%", async () => {
      expect(await shardTip.platformFeePercentage()).to.equal(250)
    })
  })

  describe("Tipping", () => {
    it("Should allow sending tips", async () => {
      const tipAmount = ethers.parseEther("0.001")

      await expect(shardTip.connect(tipper).tip(creator.address, { value: tipAmount }))
        .to.emit(shardTip, "TipSent")
        .withArgs(tipper.address, creator.address, tipAmount, await time.latest())

      const pendingTips = await shardTip.getPendingTips(creator.address)
      const expectedAmount = tipAmount - (tipAmount * 250n) / 10000n // Subtract 2.5% fee
      expect(pendingTips).to.equal(expectedAmount)
    })

    it("Should reject zero amount tips", async () => {
      await expect(shardTip.connect(tipper).tip(creator.address, { value: 0 })).to.be.revertedWith(
        "ShardTip: Tip amount must be greater than 0",
      )
    })

    it("Should reject self-tipping", async () => {
      const tipAmount = ethers.parseEther("0.001")
      await expect(shardTip.connect(creator).tip(creator.address, { value: tipAmount })).to.be.revertedWith(
        "ShardTip: Cannot tip yourself",
      )
    })
  })

  describe("Claiming", () => {
    beforeEach(async () => {
      const tipAmount = ethers.parseEther("0.001")
      await shardTip.connect(tipper).tip(creator.address, { value: tipAmount })
    })

    it("Should allow creators to claim tips", async () => {
      const initialBalance = await ethers.provider.getBalance(creator.address)
      const pendingTips = await shardTip.getPendingTips(creator.address)

      const tx = await shardTip.connect(creator).claimTips()
      const receipt = await tx.wait()
      
      // Check the event was emitted with correct parameters
      const event = receipt.logs.find(log => {
        try {
          const parsed = shardTip.interface.parseLog(log)
          return parsed.name === "TipsClaimed"
        } catch {
          return false
        }
      })
      
      expect(event).to.not.be.undefined
      const parsedEvent = shardTip.interface.parseLog(event)
      expect(parsedEvent.args[0]).to.equal(creator.address)
      expect(parsedEvent.args[1]).to.equal(pendingTips)

      expect(await shardTip.getPendingTips(creator.address)).to.equal(0)
    })

    it("Should reject claiming when no tips pending", async () => {
      await expect(shardTip.connect(otherAccount).claimTips()).to.be.revertedWith("ShardTip: No tips to claim")
    })
  })

  describe("Platform Management", () => {
    it("Should allow owner to update platform fee", async () => {
      const newFee = 300 // 3%
      await expect(shardTip.connect(owner).updatePlatformFee(newFee))
        .to.emit(shardTip, "PlatformFeeUpdated")
        .withArgs(newFee)

      expect(await shardTip.platformFeePercentage()).to.equal(newFee)
    })

    it("Should reject platform fee above maximum", async () => {
      const highFee = 600 // 6% (above 5% max)
      await expect(shardTip.connect(owner).updatePlatformFee(highFee)).to.be.revertedWith("ShardTip: Fee too high")
    })
  })
})
