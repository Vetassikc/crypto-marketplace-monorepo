import { useQuery } from '@tanstack/react-query'

export type Listing = {
  id: string
  title: string
  price: string
  currency: string
  images?: string[]
  description?: string
  category?: string
  seller: {
    name: string | null
  }
}

export type SearchParams = {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

async function fetchListings(params?: SearchParams): Promise<Listing[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = new URL(`${apiUrl}/listings`);
  
  if (params?.query) url.searchParams.append('q', params.query);
  if (params?.minPrice) url.searchParams.append('minPrice', params.minPrice.toString());
  if (params?.maxPrice) url.searchParams.append('maxPrice', params.maxPrice.toString());
  if (params?.category && params.category !== 'All') url.searchParams.append('category', params.category);
  if (params?.sortBy) url.searchParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) url.searchParams.append('sortOrder', params.sortOrder);

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  return res.json()
}

export function useListings(params?: SearchParams) {
  // Create a stable query key based on params
  const queryKey = ['listings', JSON.stringify(params)];

  return useQuery({
    queryKey,
    queryFn: () => fetchListings(params),
  })
}
