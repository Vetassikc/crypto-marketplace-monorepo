import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SortOption = 'date_desc' | 'date_asc' | 'price_asc' | 'price_desc';

interface MarketplaceContextType {
  search: string;
  setSearch: (search: string) => void;
  debouncedSearch: string;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <MarketplaceContext.Provider value={{
      search,
      setSearch,
      debouncedSearch,
      sortBy,
      setSortBy
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplaceContext() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplaceContext must be used within a MarketplaceProvider');
  }
  return context;
}
