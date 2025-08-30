import { ethers } from 'ethers';
import 'dotenv/config';

// Shardeum Unstablenet configuration
const SHARDEUM_RPC = 'https://api-unstable.shardeum.org';
const CHAIN_ID = 8080;

// Contract ABI for verification
const CONTRACT_ABI = [
  'function getTipperStats(address tipper) view returns (uint256 totalSent)',
  'function getCreatorStats(address creator) view returns (uint256 pendingAmount, uint256 totalReceived)',
  'function platformFeePercentage() view returns (uint256)',
  'function totalTipsVolume() view returns (uint256)',
  'function totalTransactions() view returns (uint256)',
  'function totalPlatformFees() view returns (uint256)',
  'event TipSent(address indexed tipper, address indexed creator, uint256 amount, uint256 timestamp)',
  'event TipsClaimed(address indexed creator, uint256 amount, uint256 timestamp)'
];

// Verification criteria
const VERIFICATION_CRITERIA = {
  MIN_TIP_AMOUNT: ethers.parseEther('0.001'), // 0.001 SHM minimum
  MIN_TOTAL_SENT: ethers.parseEther('0.005'), // 0.005 SHM total sent
  MIN_TRANSACTIONS: 1, // At least 1 tip sent
  TIME_WINDOW: 7 * 24 * 60 * 60, // 7 days in seconds
};

export async function GET(request) {
  // Get URL parameters
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  try {
    const wallet = searchParams.get('wallet');

    // Validate wallet address
    if (!wallet || !ethers.isAddress(wallet)) {
      return Response.json({
        error: 'Invalid wallet address provided',
        status: 'fail',
        data: {
          verified: false,
          reason: 'Invalid wallet address'
        }
      }, { status: 400 });
    }

    // Get contract address from environment
    const contractAddress = process.env.NEXT_PUBLIC_SHARDTIP_CONTRACT_ADDRESS;
    console.log('Contract address from env:', contractAddress);
    
    if (!contractAddress) {
      return Response.json({
        error: 'Contract address not configured',
        status: 'fail',
        data: {
          verified: false,
          reason: 'System configuration error'
        }
      }, { status: 500 });
    }

    // Connect to Shardeum network
    const provider = new ethers.JsonRpcProvider(SHARDEUM_RPC);
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

    // Get verification data
    const verificationResult = await verifyWalletActivity(wallet, contract, provider);

    // Return verification result
    return Response.json({
      status: 'success',
      data: verificationResult,
      timestamp: new Date().toISOString(),
      network: 'Shardeum Unstablenet',
      chainId: CHAIN_ID
    }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Verification API error:', error);
    console.error('Error stack:', error.stack);
    
    return Response.json({
      error: 'Internal server error during verification',
      status: 'fail',
      data: {
        verified: false,
        reason: 'Verification service unavailable',
        details: error.message
      }
    }, { status: 500 });
  }
}

async function verifyWalletActivity(walletAddress, contract, provider) {
  try {
    // Get tipper statistics
    const tipperStats = await contract.getTipperStats(walletAddress);
    const totalSent = tipperStats;

    // Get creator statistics
    const creatorStats = await contract.getCreatorStats(walletAddress);
    const [pendingAmount, totalReceived] = creatorStats;

    // Get recent tip events for this wallet
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Last 10k blocks

    const tipEvents = await contract.queryFilter(
      contract.filters.TipSent(walletAddress, null),
      fromBlock,
      currentBlock
    );

    const claimEvents = await contract.queryFilter(
      contract.filters.TipsClaimed(walletAddress),
      fromBlock,
      currentBlock
    );

    // Calculate verification metrics
    const verificationMetrics = {
      totalTipsSent: ethers.formatEther(totalSent),
      totalTipsReceived: ethers.formatEther(totalReceived),
      pendingTips: ethers.formatEther(pendingAmount),
      tipTransactions: tipEvents.length,
      claimTransactions: claimEvents.length,
      totalTransactions: tipEvents.length + claimEvents.length,
      recentActivity: tipEvents.length > 0 || claimEvents.length > 0,
      hasMinimumActivity: totalSent >= VERIFICATION_CRITERIA.MIN_TOTAL_SENT,
      hasRecentActivity: await checkRecentActivity(tipEvents, claimEvents)
    };

    // Determine verification status
    const verified = determineVerificationStatus(verificationMetrics);

    return {
      verified,
      wallet: walletAddress,
      metrics: verificationMetrics,
      criteria: {
        minimumTipAmount: ethers.formatEther(VERIFICATION_CRITERIA.MIN_TIP_AMOUNT),
        minimumTotalSent: ethers.formatEther(VERIFICATION_CRITERIA.MIN_TOTAL_SENT),
        minimumTransactions: VERIFICATION_CRITERIA.MIN_TRANSACTIONS,
        timeWindow: `${VERIFICATION_CRITERIA.TIME_WINDOW / (24 * 60 * 60)} days`
      },
      reason: verified ? 'Wallet has completed required tipping activities' : 'Insufficient tipping activity',
      verificationDate: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error verifying wallet activity:', error);
    throw new Error('Failed to verify wallet activity');
  }
}

async function checkRecentActivity(tipEvents, claimEvents) {
  const currentTime = Math.floor(Date.now() / 1000);
  const timeWindow = VERIFICATION_CRITERIA.TIME_WINDOW;

  // Check if there are any recent events within the time window
  const recentTipEvents = tipEvents.filter(event => {
    const eventTime = Number(event.args[3]); // timestamp
    return (currentTime - eventTime) <= timeWindow;
  });

  const recentClaimEvents = claimEvents.filter(event => {
    const eventTime = Number(event.args[2]); // timestamp
    return (currentTime - eventTime) <= timeWindow;
  });

  return recentTipEvents.length > 0 || recentClaimEvents.length > 0;
}

function determineVerificationStatus(metrics) {
  // Wallet is verified if it meets any of these criteria:
  
  // 1. Has sent minimum total amount in tips
  if (metrics.hasMinimumActivity) {
    return true;
  }

  // 2. Has recent activity (tips or claims in last 7 days)
  if (metrics.hasRecentActivity && metrics.totalTransactions >= VERIFICATION_CRITERIA.MIN_TRANSACTIONS) {
    return true;
  }

  // 3. Has received tips (showing engagement with the platform)
  if (Number(metrics.totalTipsReceived) > 0 && metrics.totalTransactions >= VERIFICATION_CRITERIA.MIN_TRANSACTIONS) {
    return true;
  }

  return false;
}
