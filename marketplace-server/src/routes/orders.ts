import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import type { CreateOrderBody } from '../types/index.js';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * POST /api/orders
 * Create a new order (for crypto payments)
 */
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { productId, transactionHash, paymentMethod } = req.body as CreateOrderBody;

    if (!productId || !paymentMethod) {
      throw ApiError.badRequest('Product ID and payment method are required');
    }

    if (paymentMethod === 'CRYPTO' && !transactionHash) {
      throw ApiError.badRequest('Transaction hash is required for crypto payments');
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    const order = await prisma.order.create({
      data: {
        buyerWalletAddress: req.user!.walletAddress,
        productId,
        transactionHash: transactionHash || null,
        paymentMethod,
      },
    });

    res.status(201).json({ success: true, data: order });
  })
);

/**
 * GET /api/orders
 * Get orders for a user
 */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    
    const orders = await prisma.order.findMany({
      where: { buyerWalletAddress: req.user!.walletAddress },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            imageUrls: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  })
);

export default router;
