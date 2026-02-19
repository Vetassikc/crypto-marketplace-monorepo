# Marketplace V2 Architecture (As of February 18, 2026)

## 1. Executive Summary
Marketplace V2 is a Turborepo monorepo with:
- Web app (`apps/web`, Next.js App Router)
- API app (`apps/api`, NestJS + Prisma)
- Shared packages (`packages/database`, `packages/ui`, `packages/contracts`)

The project already has a working base for listings, wallet-linked users, orders, and early crypto escrow UX.
It is still in **MVP-hardening phase**, not production-ready yet.

## 2. As-Is Architecture

### 2.1 Monorepo Layout
- `apps/web`: user-facing marketplace UI + AI API routes
- `apps/api`: listings/orders/users REST API
- `packages/database`: Prisma schema and generated client
- `packages/contracts`: Solidity escrow/marketplace contracts, Hardhat scripts
- `docs`: product and technical documentation

### 2.2 Runtime Components
1. **Web UI (Next.js)**  
Handles listing browsing, seller UI, wallet connection, and escrow interaction.

2. **Backend API (NestJS)**  
Provides CRUD-style endpoints for listings/orders/users and reads/writes PostgreSQL.

3. **PostgreSQL (Docker/local)**  
Main source of truth for users, listings, wallets, orders.

4. **AI Providers**  
- Smart search route uses Google Gemini through Vercel AI SDK  
- Description generation route uses OpenRouter via Vercel AI SDK

5. **Smart Contracts (Tempo testnet)**  
Escrow contract for token-based payment flow is integrated at UI level.

## 3. Subprocesses

### 3.1 Wallet Login
1. User connects wallet in web app.
2. Web app sends wallet address + network to `POST /users/login`.
3. API creates/fetches `User` + `Wallet`.
4. User context is set in frontend.

Current gap: no SIWE signature verification yet.

### 3.2 Listing Lifecycle
1. Seller opens `/sell`.
2. Optional AI generation from image URL.
3. Listing is created through `POST /listings`.
4. Listing appears in `/listings` and `/my-listings`.

Current gap: no robust ownership/auth guard on backend endpoints.

### 3.3 Buy Flow (Crypto Escrow Path)
1. Buyer opens listing page.
2. UI checks chain/allowance/balance.
3. Buyer approves token spend.
4. Buyer creates escrow transaction.
5. UI posts order with tx hash to backend.

Current gap: backend order creation still uses hardcoded buyer patterns in some paths.

### 3.4 AI Smart Search
1. User submits natural language query in `/listings`.
2. `/api/smart-search` converts text to structured filters.
3. UI applies filters and fetches `/listings`.

Current gap: no strict schema validation for LLM output.

### 3.5 Fiat Payment (Target)
Not implemented yet. This is a roadmap requirement and must be designed as a separate payment bounded context.

## 4. Data Model (Current Core)
- `User` (role, profile fields)
- `Wallet` (address, network, linked to user)
- `Listing` (title, description, price, currency, images, seller)
- `Order` (listing, buyer, status, optional txHash)

## 5. Key Risks in Current State
1. Security gaps: missing authz boundaries and no SIWE verification.
2. Operational gaps: no CI pipeline, incomplete quality gates.
3. Process gaps: no stable agent workflow artifacts in root (task backlog, execution log were missing).
4. Documentation drift: several docs were stale or template-based.
5. Product gap: fiat flow and AI Accountant are not implemented yet.

## 6. Target Architecture (MVP to Production)

### 6.1 Domain Boundaries
- Identity & Access (wallet auth, SIWE, roles)
- Catalog (listings, categories, search)
- Checkout (fiat + crypto orchestrator)
- Escrow Ledger (on-chain lifecycle + indexing)
- AI Services (search parser, listing writer, AI accountant)
- Reporting (seller analytics, accounting exports)

### 6.2 Integration Strategy
- Use API gateway-like backend module boundaries in NestJS.
- Keep smart contract writes in dedicated service layer.
- Add event-driven order state updates (webhook/indexer queue).
- Add provider abstraction for AI models and payment processors.

### 6.3 Non-Functional Targets
- Secure-by-default auth & authorization
- Deterministic CI (lint, typecheck, tests)
- Observability (structured logs + error monitoring)
- Test pyramid coverage on API + critical UI flows

## 7. Architecture Decision Priorities
1. Auth & security baseline (SIWE + endpoint guards)
2. Checkout domain split (fiat vs crypto orchestration)
3. Order/escrow consistency model
4. AI accountant bounded context and data contracts
5. CI/CD + release gates
