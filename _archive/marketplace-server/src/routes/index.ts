import { Router } from 'express';
import usersRouter from './users.js';
import productsRouter from './products.js';
import storesRouter from './stores.js';
import stripeRouter from './stripe.js';
import ordersRouter from './orders.js';
import categoriesRouter from './categories.js';
import sellersRouter from './sellers.js';

const router = Router();

// Mount all routes
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/stores', storesRouter);
router.use('/stripe', stripeRouter);
router.use('/orders', ordersRouter);
router.use('/categories', categoriesRouter);
router.use('/sellers', sellersRouter);

// Legacy route compatibility
router.post('/create-payment-intent', (req, res, next) => {
  // Redirect to new path
  req.url = '/stripe/create-payment-intent';
  stripeRouter(req, res, next);
});

export default router;
