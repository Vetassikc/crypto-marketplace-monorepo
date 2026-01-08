// src/types/index.ts

export interface Store {
    id: number; // Changed to number to match Prisma Int ID
    name: string;
    description: string | null;
    ownerId: number; // Changed to number
    createdAt: string;
    stripeOnboardingComplete: boolean;
}

export interface Product {
    id: number; // Changed to number
    name: string;
    description: string;
    price: number;
    // category: string; // Backend schema uses categoryId (Int) or category relation. User code passed string. Keeping string for now as per user request but noting mismatch.
    // Actually, let's use what the API returns. The API returns Prisma Product object.
    // Prisma Product has categoryId: Int | null.
    categoryId: number | null;
    category?: string; // Added for UI compatibility if backend sends it or if we map it
    imageUrls: string[];
    storeId: number; // Changed to number
    store?: {
        name: string;
        ownerId: number; // Changed to number
    };
    specifications?: any; // Added specifications
}

export interface User {
    id: number; // Changed to number
    walletAddress: string; // Using walletAddress to match backend schema
    store?: Store | null;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    deliveryAddress?: string | null;
    avatarUrl?: string | null;
    sellerStatus: string;
}
