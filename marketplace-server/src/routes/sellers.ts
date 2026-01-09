import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

// TODO: Move to environment variable or database role
const ADMIN_WALLET = process.env.ADMIN_WALLET_ADDRESS;

const requireAdmin = async (req: any, _res: any, next: any) => {
  if (ADMIN_WALLET && req.user.walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
    return next(new ApiError(403, 'Admin access required'));
  }
  // If no ADMIN_WALLET configured, allow for dev testing (WARN: Insecure)
  next();
};

/**
 * GET /api/sellers/pending
 * Get all pending seller applications
 */
router.get(
  '/pending',
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const pendingSellers = await prisma.user.findMany({
      where: { sellerStatus: 'PENDING' },
    });

    res.json({ success: true, data: pendingSellers });
  })
);

/**
 * POST /api/sellers/approve
 * Approve a seller application
 */
router.post(
  '/approve',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      throw ApiError.badRequest('Wallet address is required');
    }

    const user = await prisma.user.update({
      where: { walletAddress },
      data: { sellerStatus: 'APPROVED' },
    });

    res.json({ success: true, data: user });
  })
);

/**
 * POST /api/sellers/reject
 * Reject a seller application
 */
router.post(
  '/reject',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      throw ApiError.badRequest('Wallet address is required');
    }

    const user = await prisma.user.update({
      where: { walletAddress },
      data: { sellerStatus: 'REJECTED' },
    });

    res.json({ success: true, data: user });
  })
);

export default router;
