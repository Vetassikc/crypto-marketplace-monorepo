/**
 * Centralized API client for the marketplace
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

class ApiClient {
  private baseUrl: string;
  private walletAddress: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setWalletAddress(address: string | null) {
    this.walletAddress = address;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.walletAddress) {
      defaultHeaders['x-wallet-address'] = this.walletAddress;
    }

    // Don't set Content-Type for FormData (multipart/form-data)
    if (options.body instanceof FormData) {
      delete defaultHeaders['Content-Type'];
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data.data as T;
  }

  // Users
  async createUser(address: string) {
    return this.request<{ id: number; walletAddress: string }>('/api/users', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async getUser(address: string) {
    return this.request<{ id: number; walletAddress: string; store?: Store }>(
      `/api/users/${address}`
    );
  }

  // Products
  async getProducts(params?: {
    categoryId?: number;
    search?: string;
    sortBy?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.categoryId) searchParams.set('categoryId', String(params.categoryId));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    
    const query = searchParams.toString();
    return this.request<Product[]>(`/api/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: number) {
    return this.request<Product>(`/api/products/${id}`);
  }

  async createProduct(formData: FormData) {
    return this.request<Product>('/api/products', {
      method: 'POST',
      body: formData,
    });
  }

  async updateProduct(id: number, formData: FormData) {
    return this.request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async deleteProduct(id: number, ownerAddress: string) {
    return this.request<void>(`/api/products/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ ownerAddress }),
    });
  }

  // Stores
  async createStore(name: string, description: string, ownerAddress: string) {
    return this.request<Store>('/api/stores', {
      method: 'POST',
      body: JSON.stringify({ name, description, ownerAddress }),
    });
  }

  async getMyStore(address: string) {
    return this.request<{ store: Store | null }>(`/api/stores/me?address=${address}`);
  }

  async updateCryptoWallet(ownerAddress: string, cryptoWallet: string) {
    return this.request<Store>('/api/stores/crypto-wallet', {
      method: 'POST',
      body: JSON.stringify({ ownerAddress, cryptoWallet }),
    });
  }

  // Categories
  async getCategories() {
    return this.request<Category[]>('/api/categories');
  }

  async getCategoryFilters(categoryId: number) {
    return this.request<Record<string, unknown>>(`/api/categories/${categoryId}/filters`);
  }

  // Stripe
  async startStripeConnect(ownerAddress: string) {
    return this.request<{ url: string }>('/api/stripe/connect', {
      method: 'POST',
      body: JSON.stringify({ ownerAddress }),
    });
  }

  async checkStripeStatus(ownerAddress: string) {
    return this.request<{ isComplete: boolean }>('/api/stripe/status', {
      method: 'POST',
      body: JSON.stringify({ ownerAddress }),
    });
  }

  async createPaymentIntent(productId: number) {
    return this.request<{ clientSecret: string }>('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  // Orders
  async createOrder(
    walletAddress: string,
    productId: number,
    transactionHash: string,
    paymentMethod: 'STRIPE' | 'CRYPTO'
  ) {
    return this.request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, productId, transactionHash, paymentMethod }),
    });
  }

  async getOrders(walletAddress: string) {
    return this.request<Order[]>(`/api/orders?walletAddress=${walletAddress}`);
  }

  // Sellers (Admin)
  async getPendingSellers() {
    return this.request<User[]>('/api/sellers/pending');
  }

  async approveSeller(walletAddress: string) {
    return this.request<User>('/api/sellers/approve', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }

  async rejectSeller(walletAddress: string) {
    return this.request<User>('/api/sellers/reject', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }
}

// Types
interface User {
  id: number;
  walletAddress: string;
  sellerStatus: string;
}

interface Store {
  id: number;
  name: string;
  description: string | null;
  stripeAccountId: string | null;
  stripeOnboardingComplete: boolean;
  cryptoWalletAddress: string | null;
  products?: Product[];
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrls: string[];
  storeId: number;
  categoryId?: number;
  specifications?: Record<string, unknown>;
  store?: {
    name: string;
    stripeAccountId?: string;
    stripeOnboardingComplete?: boolean;
    cryptoWalletAddress?: string;
  };
}

interface Category {
  id: number;
  name: string;
  parentId: number | null;
  children?: Category[];
}

interface Order {
  id: number;
  buyerWalletAddress: string;
  productId: number;
  paymentMethod: string;
  transactionHash: string | null;
  product?: {
    name: string;
    price: number;
    imageUrls: string[];
  };
}

// Singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Re-export types
export type { User, Store, Product, Category, Order };
