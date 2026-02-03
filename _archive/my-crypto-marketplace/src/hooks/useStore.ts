import { useState, useEffect, useCallback } from 'react';
import { apiClient, Store } from '../api/client';
import { useWallet } from '../context/WalletContext';

interface UseStoreReturn {
  store: Store | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createStore: (name: string, description: string) => Promise<Store>;
  updateCryptoWallet: (walletAddress: string) => Promise<void>;
}

export function useStore(): UseStoreReturn {
  const { account } = useWallet();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStore = useCallback(async () => {
    if (!account) {
      setStore(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getMyStore(account);
      setStore(data.store);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch store');
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const createStore = useCallback(async (name: string, description: string): Promise<Store> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    const newStore = await apiClient.createStore(name, description, account);
    setStore(newStore);
    return newStore;
  }, [account]);

  const updateCryptoWallet = useCallback(async (walletAddress: string) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    const updatedStore = await apiClient.updateCryptoWallet(account, walletAddress);
    setStore(updatedStore);
  }, [account]);

  return { store, loading, error, refetch: fetchStore, createStore, updateCryptoWallet };
}
