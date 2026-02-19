# PROJECT CONTEXT: Hybrid Crypto Marketplace

## 1. Project Overview

Full-stack e-commerce marketplace platform enabling sellers to register, list products, and receive payments.

**Unique Value Proposition:** Hybrid payment system supporting both Fiat (via Stripe Connect) and Crypto (via ETH/USDC on Sepolia testnet).

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js + TypeScript, Material-UI (MUI), ethers.js |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL, Prisma ORM |
| **Blockchain** | Solidity (Smart Contracts), Hardhat |
| **Target Network** | **Tempo Testnet** (EVM compatible) |

## 3. Project Structure (Post-Refactoring)

Marketplace/
├── apps/
│   ├── api/                    # ✅ Backend (NestJS + Prisma)
│   │   ├── src/
│   │   │   ├── main.ts         # ✅ Entry point (Port 3001)
│   │   │   ├── app.module.ts   # ✅ Root Module
│   │   │   └── ...             # Modular resources
│   │   └── package.json
│   │
│   └── web/                    # ✅ Frontend (Next.js 15, React 19)
│       ├── app/                # ✅ App Router
│       ├── components/         # ✅ React Components
│       ├── hooks/              # ✅ Custom Hooks
│       └── package.json
│
├── packages/
│   ├── contracts/              # ✅ Smart Contracts (Hardhat)
│   ├── database/               # ✅ Prisma Schema & Client
│   ├── ui/                     # ✅ Shared UI Components
│   └── typescript-config/      # ✅ Shared TS Config
│
├── _archive/                   # 📦 Legacy Code
│
├── package.json                # ✅ Root TurboRepo Config
└── quickstart.sh               # 🚀 Universal Launch Script


## 4. Database Schema (Key Models)

```prisma
model User {
  walletAddress   String   @unique
  sellerStatus    String   // NOT_SELLER, PENDING, APPROVED, REJECTED
  store           Store?
  orders          Order[]
}

model Store {
  name                     String
  stripeAccountId          String?    # ✅ Stripe Connect
  stripeOnboardingComplete Boolean
  cryptoWalletAddress      String?    # ✅ For crypto payouts
  products                 Product[]
}

model Product {
  name          String
  description   String?
  price         Float
  imageUrls     String[]
  categoryId    Int?
  specifications Json?
  store         Store
}

model Order {
  paymentMethod   PaymentMethod   # STRIPE or CRYPTO
  transactionHash String?
  product         Product
  buyer           User
}
```

## 5. Payment Flows

### A. Fiat (Stripe Connect) — ✅ IMPLEMENTED

1. **Onboarding:** `POST /api/stripe/connect` → returns Stripe onboarding URL
2. **Status Check:** `POST /api/stripe/status` → verifies `charges_enabled`
3. **Payment:** `POST /api/stripe/create-payment-intent` → Payment Intent with 5% platform fee

### B. Crypto (ETH on Sepolia) — ✅ IMPLEMENTED

1. **Smart Contract:** `Marketplace.sol` with:
   - Seller registration (`registerSeller`)
   - Product listing (`addOrUpdateProduct`)
   - Purchase function (`buyProduct`) — Uses ETH
2. **Frontend:** Hybrid checkout UI with Card/Crypto toggle
3. **Order tracking:** Transaction hash stored in database

## 6. Environment Variables

### Backend (`apps/api/.env`)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marketplace"
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK_CHAIN_ID=123456  # Tempo Testnet
```

## 7. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create/register user |
| GET | `/api/users/:address` | Get user by wallet |
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create product (multipart) |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/stores` | Create store |
| GET | `/api/stores/me` | Get current user's store |
| POST | `/api/stores/crypto-wallet` | Set crypto payout address |
| POST | `/api/stripe/connect` | Start Stripe onboarding |
| POST | `/api/stripe/status` | Check Stripe status |
| POST | `/api/stripe/create-payment-intent` | Create payment |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/categories` | List categories |
| GET | `/api/sellers/pending` | List pending sellers |
| POST | `/api/sellers/approve` | Approve seller |

## 8. Quick Start

```bash
# From project root
./quickstart.sh

# Options:
./quickstart.sh --fresh    # Clean install
./quickstart.sh --db-only  # Only start database
./quickstart.sh --skip-db  # Skip database (use external)
```

## 9. Architecture Highlights

### Backend (Post-Refactoring)
- **Modular routes:** Each domain has its own route file
- **Centralized error handling:** `ApiError` class + global middleware
- **Request logging:** Method, URL, status, response time
- **Config validation:** Environment variables checked at startup
- **Async handling:** `asyncHandler` wrapper for automatic error catching

### Frontend (Post-Refactoring)
- **WalletContext:** Centralized wallet connection management
- **API Client:** Type-safe, singleton API client with all endpoints
- **Custom Hooks:** `useProducts`, `useStore` for data fetching
- **Error Boundaries:** Graceful error handling
- **Layout Component:** Consistent navigation and footer

## 10. Remaining TODOs

- [x] Add authentication middleware to protect seller routes
- [ ] Implement services layer for complex business logic
- [ ] Add unit tests for routes and services
- [ ] Configure production build and deployment
- [ ] Add rate limiting and security headers
- [ ] Implement image optimization and CDN integration
