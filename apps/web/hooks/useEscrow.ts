import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { tempoTestnet } from '@/lib/tempo-chain'
import { parseEther } from 'viem';
import { ESCROW_ADDRESS, ESCROW_ABI, AUSD_ADDRESS, ERC20_ABI } from '@/lib/contracts';
import { toast } from 'sonner';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export function useEscrow() {
  const { address: userAddress } = useAccount();
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: AUSD_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [userAddress || '0x0000000000000000000000000000000000000000', ESCROW_ADDRESS],
    query: {
      enabled: !!userAddress,
    }
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: AUSD_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress || '0x0000000000000000000000000000000000000000'],
    chainId: tempoTestnet.id,
    query: {
      enabled: !!userAddress,
    }
  });

  const approvePayment = async (amount: string) => {
    try {
      console.log('Approving payment token...');
      writeContract({
        address: AUSD_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [ESCROW_ADDRESS, parseEther(amount)],
      });
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error(`Approval Failed: ${getErrorMessage(error)}`);
    }
  };

  const createEscrow = async (orderId: number, sellerAddress: string, amount: string) => {
    try {
      if (!sellerAddress || !sellerAddress.startsWith('0x')) {
          throw new Error("Invalid seller wallet address");
      }
      
      console.log('Creating escrow transaction:', {
        address: ESCROW_ADDRESS,
        args: [BigInt(orderId), sellerAddress, parseEther(amount)],
      });

      writeContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'createEscrow',
        args: [BigInt(orderId), sellerAddress as `0x${string}`, parseEther(amount)],
      });
    } catch (error) {
      console.error('Error creating escrow:', error);
      toast.error(`Transaction Failed: ${getErrorMessage(error)}`);
    }
  };

  return {
    approvePayment,
    createEscrow,
    allowance,
    balance,       // Exported
    refetchAllowance,
    refetchBalance, // Exported
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    writeError
  };
}
