import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { apiClient } from '../api/client';

interface WalletContextType {
  account: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

const CHAIN_ID = process.env.REACT_APP_NETWORK_CHAIN_ID || '0xaa36a7'; // Sepolia default

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID }],
      });
    } catch (error: unknown) {
      const err = error as { code?: number };
      if (err.code === 4902) {
        toast.error('Please add the network to your wallet first');
      } else {
        toast.error('Failed to switch network');
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const network = await browserProvider.getNetwork();
      
      // Check and switch network if needed
      if (network.chainId !== BigInt(CHAIN_ID)) {
        await switchNetwork();
      }

      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const userAccount = accounts[0];
      const userSigner = await browserProvider.getSigner();

      setAccount(userAccount);
      setProvider(browserProvider);
      setSigner(userSigner);
      apiClient.setWalletAddress(userAccount);

      // Register user in backend
      try {
        await apiClient.createUser(userAccount);
      } catch {
        // User might already exist, that's okay
      }

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [switchNetwork]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    apiClient.setWalletAddress(null);
    toast.info('Wallet disconnected');
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[];
      if (accs.length === 0) {
        disconnect();
      } else if (accs[0] !== account) {
        setAccount(accs[0]);
        apiClient.setWalletAddress(accs[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, disconnect]);

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return;
      
      try {
        const result = await window.ethereum.request({ method: 'eth_accounts' });
        const accounts = result as string[];
        if (accounts.length > 0) {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const userSigner = await browserProvider.getSigner();
          
          setAccount(accounts[0]);
          setProvider(browserProvider);
          setSigner(userSigner);
          apiClient.setWalletAddress(accounts[0]);
        }
      } catch {
        // Silently fail
      }
    };

    checkConnection();
  }, []);

  const value: WalletContextType = {
    account,
    isConnecting,
    isConnected: !!account,
    connect,
    disconnect,
    switchNetwork,
    provider,
    signer,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
