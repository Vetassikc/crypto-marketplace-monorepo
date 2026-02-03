// Shared types for the API

export interface User {
  id: number;
  walletAddress: string;
  sellerStatus: 'NOT_SELLER' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  stripeAccountId: string | null;
  stripeOnboardingComplete: boolean;
  cryptoWalletAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrls: string[];
  storeId: number;
  categoryId: number | null;
  specifications: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  buyerWalletAddress: string;
  productId: number;
  paymentMethod: 'STRIPE' | 'CRYPTO';
  transactionHash: string | null;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  specificationsTemplate: Record<string, unknown> | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

// Request body types
export interface CreateUserBody {
  address: string;
}

export interface CreateStoreBody {
  name: string;
  description?: string;
  ownerAddress: string;
}

export interface UpdateCryptoWalletBody {
  ownerAddress: string;
  cryptoWallet: string;
}

export interface CreateProductBody {
  name: string;
  description?: string;
  price: string;
  category?: string;
  ownerAddress: string;
}

export interface CreateOrderBody {
  walletAddress: string;
  productId: number;
  transactionHash: string;
  paymentMethod: 'STRIPE' | 'CRYPTO';
  shippingDetails?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
}

export interface StripeConnectBody {
  ownerAddress: string;
}

export interface CreatePaymentIntentBody {
  productId: number;
}
