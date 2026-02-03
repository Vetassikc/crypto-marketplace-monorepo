import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import type { CreateStoreBody, UpdateCryptoWalletBody } from '../types/index.js';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * POST /api/stores
 * Create a new store
 */
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name, description } = req.body as CreateStoreBody;

    if (!name) {
      throw ApiError.badRequest('Name is required');
    }

    // Check if user already has a store
    const existingStore = await prisma.store.findUnique({
      where: { ownerId: req.user!.id },
    });

    if (existingStore) {
      throw ApiError.badRequest('User already has a store');
    }

    const store = await prisma.store.create({
      data: {
        name,
        description: description || null,
        ownerId: req.user!.id,
        stripeOnboardingComplete: false,
      },
    });

    res.status(201).json({ success: true, data: store });
  })
);

/**
 * GET /api/stores/me
 * Get current user's store
 */
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { 
        store: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({ success: true, data: { store: user.store } });
  })
);

/**
 * POST /api/stores/crypto-wallet
 * Update seller's crypto wallet address
 */
router.post(
  '/crypto-wallet',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { cryptoWallet } = req.body as UpdateCryptoWalletBody;

    if (!cryptoWallet) {
      throw ApiError.badRequest('Crypto wallet address is required');
    }

    // Validate EVM address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(cryptoWallet)) {
      throw ApiError.badRequest('Invalid wallet address format');
    }

    const userStore = await prisma.store.findUnique({
      where: { ownerId: req.user!.id },
    });

    if (!userStore) {
      throw ApiError.notFound('Store not found');
    }

    const updatedStore = await prisma.store.update({
      where: { id: userStore.id },
      data: { cryptoWalletAddress: cryptoWallet },
    });

    res.json({ success: true, data: updatedStore });
  })
);

export default router;
