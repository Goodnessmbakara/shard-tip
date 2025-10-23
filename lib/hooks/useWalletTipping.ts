import { useAccount, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import ShardTipABI from '../contracts/ShardTip.json' assert { type: 'json' };

// Contract address from deployment
const SHARD_TIP_ADDRESS = '0xF7936D54CE16CdBC7725091945b36655Cfa74167';

export function useWalletTipping() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const sendTip = async (creatorAddress: string, amount: number) => {
    if (!isConnected || !walletClient) {
      throw new Error('Wallet not connected');
    }

    if (!address) {
      throw new Error('No wallet address available');
    }

    try {
      console.log(`Sending ${amount} ETH tip to ${creatorAddress}`);
      
      const hash = await walletClient.writeContract({
        address: SHARD_TIP_ADDRESS as `0x${string}`,
        abi: ShardTipABI,
        functionName: 'tip',
        args: [creatorAddress as `0x${string}`],
        value: parseEther(amount.toString()),
      });

      console.log(`Tip sent successfully! Transaction hash: ${hash}`);
      return hash;
    } catch (error) {
      console.error('Failed to send tip:', error);
      throw error;
    }
  };

  return {
    sendTip,
    isConnected,
    address,
  };
}
