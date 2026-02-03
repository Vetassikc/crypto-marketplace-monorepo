import { Router } from 'express';
import Stripe from 'stripe';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/index.js';
import type { CreatePaymentIntentBody } from '../types/index.js';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();
const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2025-07-30.basil',
});

/**
 * POST /api/stripe/connect
 * Start Stripe Connect onboarding for a seller
 */
router.post(
  '/connect',
  requireAuth,
  asyncHandler(async (req, res) => {
    // req.user is guaranteed by requireAuth
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { store: true },
    });

    if (!user?.store) {
      throw ApiError.notFound('Store not found');
    }

    let accountId = user.store.stripeAccountId;

    // Create Stripe account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'standard',
      });
      accountId = account.id;

      await prisma.store.update({
        where: { id: user.store.id },
        data: { stripeAccountId: accountId },
      });
    }

    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${config.frontendUrl}/dashboard?stripe=refresh`,
      return_url: `${config.frontendUrl}/dashboard?stripe=success`,
      type: 'account_onboarding',
    });

    res.json({ success: true, data: { url: accountLink.url } });
  })
);

/**
 * POST /api/stripe/status
 * Check if seller has completed Stripe onboarding
 */
router.post(
  '/status',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { store: true },
    });

    if (!user?.store?.stripeAccountId) {
      res.json({ success: true, data: { isComplete: false } });
      return;
    }

    const account = await stripe.accounts.retrieve(user.store.stripeAccountId);
    const isComplete = account.charges_enabled;

    // Update local status if changed
    if (user.store.stripeOnboardingComplete !== isComplete) {
      await prisma.store.update({
        where: { id: user.store.id },
        data: { stripeOnboardingComplete: isComplete },
      });
    }

    res.json({ success: true, data: { isComplete } });
  })
);

/**
 * POST /api/stripe/create-payment-intent
 * Create a payment intent for a product purchase
 */
router.post(
  '/create-payment-intent',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { productId } = req.body as CreatePaymentIntentBody;

    if (!productId) {
      throw ApiError.badRequest('Product ID is required');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { store: true },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (!product.store?.stripeAccountId || !product.store.stripeOnboardingComplete) {
      throw ApiError.badRequest('Seller is not ready to accept payments');
    }

    // Calculate amounts (Stripe uses cents)
    const priceInCents = Math.round(product.price * 100);
    const platformFeePercent = 0.05; // 5% platform fee
    const applicationFeeAmount = Math.round(priceInCents * platformFeePercent);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: product.store.stripeAccountId,
      },
      metadata: {
        productId: product.id.toString(),
        storeId: product.store.id.toString(),
        buyerWallet: req.user!.walletAddress,
      },
    });

    res.json({ success: true, data: { clientSecret: paymentIntent.client_secret } });
  })
);

export default router;
