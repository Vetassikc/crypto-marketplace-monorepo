import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { prisma } from '../lib/prisma.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        walletAddress: string;
        sellerStatus: string;
      };
    }
  }
}

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get wallet address from headers
    // In a real app with CI/CD, we would verify a cryptographic signature here (SIWE)
    // For this stage, we trust the client-side header for simplicity, 
    // BUT we verify the user exists in our DB.
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
      throw new ApiError(401, 'Authentication required: Missing x-wallet-address header');
    }

    // 2. Find user in DB
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      throw new ApiError(401, 'User not found. Please register first.');
    }

    // 3. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireSeller = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    if (req.user.sellerStatus !== 'APPROVED') {
      throw new ApiError(403, 'Access denied: Seller account required');
    }

    next();
  } catch (error) {
    next(error);
  }
};
