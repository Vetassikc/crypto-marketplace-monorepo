import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * GET /api/categories
 * Get all categories with children
 */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      include: { children: true },
    });

    res.json({ success: true, data: categories });
  })
);

/**
 * GET /api/categories/:id/filters
 * Get filter template for a category
 */
router.get(
  '/:id/filters',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category || !category.specificationsTemplate) {
      res.json({ success: true, data: {} });
      return;
    }

    res.json({ success: true, data: category.specificationsTemplate });
  })
);

export default router;
