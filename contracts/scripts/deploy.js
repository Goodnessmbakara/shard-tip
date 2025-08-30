const { ethers } = require("hardhat")

async function main() {
  console.log("Deploying ShardTip contract to Shardeum Unstablenet...")

  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying with account:", deployer.address)

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log("Account balance:", ethers.formatEther(balance), "SHM")

  // Deploy the contract
  const ShardTip = await ethers.getContractFactory("ShardTip")
  const shardTip = await ShardTip.deploy()

  await shardTip.waitForDeployment()
  const contractAddress = await shardTip.getAddress()

  console.log("ShardTip deployed to:", contractAddress)
  console.log("Transaction hash:", shardTip.deploymentTransaction().hash)

  // Verify deployment
  console.log("Verifying deployment...")
  const owner = await shardTip.owner()
  const platformFee = await shardTip.platformFeePercentage()

  console.log("Contract owner:", owner)
  console.log("Platform fee:", platformFee.toString(), "basis points")

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    network: "shardeum-unstablenet",
    chainId: 8080,
    deploymentHash: shardTip.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
  }

  console.log("\n=== Deployment Complete ===")
  console.log("Contract Address:", contractAddress)
  console.log("Add this to your frontend environment variables:")
  console.log(`NEXT_PUBLIC_SHARDTIP_CONTRACT_ADDRESS=${contractAddress}`)

  return deploymentInfo
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error)
    process.exit(1)
  })
