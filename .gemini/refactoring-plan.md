# 🔧 Refactoring Plan: Crypto Marketplace

## Current Issues

### Backend (`marketplace-server/`)
1. **Single file architecture** - All 500+ lines in one `index.ts`
2. **No error handling middleware** - Errors handled inconsistently
3. **No input validation** - Only basic checks
4. **No authentication/authorization** - Anyone can call any endpoint
5. **Mixed concerns** - Routes, business logic, and data access all together
6. **No environment validation** - Crashes on missing env vars
7. **No request logging** - Hard to debug

### Frontend (`my-crypto-marketplace/`)
1. **Mixed JS/TS files** - Inconsistent (`App.js`, `Admin.js` vs `Dashboard.tsx`)
2. **No proper state management** - Props drilling everywhere
3. **Hardcoded URLs** - `http://localhost:3001` scattered
4. **Duplicate code** - Same fetch patterns repeated
5. **No proper error boundaries** - App crashes on errors
6. **Large components** - `App.js` has 200+ lines
7. **No loading states** - UX issues

---

## Phase 1: Backend Architecture (Priority: HIGH)

### 1.1 Project Structure
```
marketplace-server/
├── src/
│   ├── index.ts                 # Entry point only
│   ├── app.ts                   # Express app setup
│   ├── config/
│   │   └── index.ts             # Environment validation
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handler
│   │   ├── logger.ts            # Request logging
│   │   └── auth.ts              # Wallet auth middleware
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── products.ts
│   │   ├── stores.ts
│   │   ├── users.ts
│   │   ├── stripe.ts
│   │   └── orders.ts
│   ├── services/
│   │   ├── productService.ts
│   │   ├── storeService.ts
│   │   ├── stripeService.ts
│   │   └── orderService.ts
│   ├── utils/
│   │   ├── ApiError.ts          # Custom error class
│   │   └── asyncHandler.ts      # Async wrapper
│   └── types/
│       └── index.ts             # Shared types
├── prisma/
├── package.json
└── tsconfig.json
```

### 1.2 Key Files to Create
- [ ] `src/config/index.ts` - Env validation with defaults
- [ ] `src/middleware/errorHandler.ts` - Centralized error handling
- [ ] `src/utils/ApiError.ts` - Custom error class
- [ ] `src/utils/asyncHandler.ts` - Try/catch wrapper
- [ ] Route files (5 files)
- [ ] Service files (4 files)

---

## Phase 2: Frontend Architecture (Priority: HIGH)

### 2.1 Convert All Files to TypeScript
- [ ] `App.js` → `App.tsx`
- [ ] `Admin.js` → `Admin.tsx`
- [ ] `Checkout.js` → `Checkout.tsx`
- [ ] `EditProduct.js` → `EditProduct.tsx`
- [ ] `ProductPage.js` → `ProductPage.tsx`
- [ ] `Profile.js` → `Profile.tsx`
- [ ] `CategorySidebar.js` → `CategorySidebar.tsx`

### 2.2 Project Structure
```
my-crypto-marketplace/src/
├── index.tsx
├── App.tsx
├── api/
│   └── client.ts               # Centralized API client
├── components/
│   ├── common/
│   │   ├── Layout.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorBoundary.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   └── ProductList.tsx
│   └── checkout/
│       ├── StripeCheckout.tsx
│       └── CryptoCheckout.tsx
├── pages/
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Admin.tsx
│   ├── Checkout.tsx
│   └── Product.tsx
├── hooks/
│   ├── useWallet.ts
│   ├── useProducts.ts
│   └── useStore.ts
├── context/
│   └── WalletContext.tsx
├── types/
│   └── index.ts
├── utils/
│   └── constants.ts
└── styles/
    └── theme.ts
```

---

## Phase 3: Shared Improvements

### 3.1 API Client
Create a centralized fetch wrapper with:
- Base URL from environment
- Error handling
- Request/response interceptors
- TypeScript types

### 3.2 Environment Setup
- `.env.example` for both projects
- Validation on startup
- Clear error messages

### 3.3 Docker Compose Enhancement
- Add health checks
- Add named volumes
- Add restart policies

---

## Execution Order

1. **Backend First** (less risky, frontend depends on it)
   - Create folder structure
   - Move routes to separate files
   - Add error handling
   - Add config validation

2. **Frontend Second**
   - Convert to TypeScript
   - Create API client
   - Add WalletContext
   - Refactor components

3. **Testing**
   - Verify all endpoints work
   - Test with frontend
   - Update quickstart script

---

## Estimated Time
- Backend refactoring: 1-2 hours
- Frontend refactoring: 2-3 hours
- Testing & fixes: 1 hour

**Total: ~4-6 hours**
