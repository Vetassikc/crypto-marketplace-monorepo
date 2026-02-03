import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import type { CreateUserBody } from '../types/index.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * POST /api/users
 * Create or find user by wallet address
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { address } = req.body as CreateUserBody;

    if (!address) {
      throw ApiError.badRequest('Wallet address is required');
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw ApiError.badRequest('Invalid wallet address format');
    }

    const user = await prisma.user.upsert({
      where: { walletAddress: address },
      update: {},
      create: { walletAddress: address },
    });

    res.json({ success: true, data: user });
  })
);

/**
 * GET /api/users/:address
 * Get user by wallet address
 */
router.get(
  '/:address',
  asyncHandler(async (req, res) => {
    const { address } = req.params;

    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      include: { store: true },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({ success: true, data: user });
  })
);

export default router;
