import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { requireAuth, requireSeller } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { pinataService } from '../services/pinata.service.js';

const router = Router();

// Setup file upload (Temporary storage before IPFS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for high-res NFTs
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * GET /api/products
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { categoryId, search, sortBy } = req.query;

    const where: Record<string, unknown> = {};

    if (categoryId) where.categoryId = parseInt(categoryId as string);
    if (search) where.name = { contains: search as string, mode: 'insensitive' };

    const orderBy = (() => {
      switch (sortBy) {
        case 'price_asc': return { price: 'asc' as const };
        case 'price_desc': return { price: 'desc' as const };
        case 'date_asc': return { createdAt: 'asc' as const };
        default: return { createdAt: 'desc' as const };
      }
    })();

    const products = await prisma.product.findMany({
      where,
      include: {
        store: { select: { name: true, ownerId: true } },
      },
      orderBy,
    });

    res.json({ success: true, data: products });
  })
);

/**
 * GET /api/products/:id
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        store: {
          select: { name: true, stripeAccountId: true, stripeOnboardingComplete: true, cryptoWalletAddress: true },
        },
      },
    });

    if (!product) throw ApiError.notFound('Product not found');
    res.json({ success: true, data: product });
  })
);

/**
 * POST /api/products
 * Modified to support IPFS via Pinata
 */
router.post(
  '/',
  requireAuth,
  requireSeller,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const { name, description, price, categoryId, specifications } = req.body;
    const imageFile = req.file;

    if (!name || !price) throw ApiError.badRequest('Name and price are required');
    if (!imageFile) throw ApiError.badRequest('Product image is required');

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) throw ApiError.badRequest('Price must be a positive number');

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { store: true },
    });

    if (!user?.store) throw ApiError.badRequest('You must create a store before adding products');

    // 1. Upload Image to Pinata (IPFS)
    let imageUrl: string;
    try {
      console.log(`Uploading ${imageFile.filename} to Pinata...`);
      const ipfsHash = await pinataService.uploadFile(imageFile.path, name);
      imageUrl = `ipfs://${ipfsHash}`; // Store as IPFS URI
      
      // Cleanup local file after upload
      fs.unlink(imageFile.path, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });
      
    } catch (error) {
      console.error('Pinata upload failed:', error);
      // Fallback: If no keys or error, use local path (for dev without keys)
      // imageUrl = `/uploads/${imageFile.filename}`;
      throw ApiError.internal('Failed to upload image to decentralized storage');
    }

    // 2. Prepare Data
    const data: Record<string, unknown> = {
      name,
      description: description || null,
      price: parsedPrice,
      imageUrls: [imageUrl], // Store IPFS URI
      storeId: user.store.id,
    };

    if (categoryId) data.categoryId = parseInt(categoryId);
    if (specifications) {
      try {
        data.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      } catch { /* ignore */ }
    }

    // 3. Save to DB
    const product = await prisma.product.create({ data: data as any });

    res.status(201).json({ success: true, data: product });
  })
);

/**
 * PUT /api/products/:id
 */
router.put(
  '/:id',
  requireAuth,
  requireSeller,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, categoryId, specifications } = req.body;
    const imageFile = req.file;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { store: true },
    });

    if (!product) throw ApiError.notFound('Product not found');
    const userStore = await prisma.store.findUnique({ where: { ownerId: req.user!.id } });
    if (!userStore || product.storeId !== userStore.id) throw ApiError.forbidden('You do not own this product');

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    
    if (imageFile) {
      try {
        const ipfsHash = await pinataService.uploadFile(imageFile.path, name || product.name);
        updateData.imageUrls = [`ipfs://${ipfsHash}`];
        fs.unlink(imageFile.path, () => {});
      } catch (error) {
        throw ApiError.internal('Failed to upload new image to IPFS');
      }
    }

    if (categoryId) updateData.categoryId = parseInt(categoryId);
    if (specifications) {
      try {
        updateData.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      } catch { /* ignore */ }
    }

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({ success: true, data: updated });
  })
);

/**
 * DELETE /api/products/:id
 */
router.delete(
  '/:id',
  requireAuth,
  requireSeller,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { store: true },
    });

    if (!product) throw ApiError.notFound('Product not found');
    const userStore = await prisma.store.findUnique({ where: { ownerId: req.user!.id } });
    if (!userStore || product.storeId !== userStore.id) throw ApiError.forbidden('You do not own this product');

    await prisma.product.delete({ where: { id: parseInt(id) } });

    res.json({ success: true, message: 'Product deleted' });
  })
);

export default router;
