# Marketplace V2 Strategic Roadmap

Last updated: February 18, 2026

## Phase 1: Foundations (Done)
Goal: establish core marketplace baseline.
- [x] Monorepo setup (TurboRepo)
- [x] Prisma data model for users, listings, orders
- [x] Wallet-linked user bootstrap
- [x] Listing create/read/update/delete flow

## Phase 2: AI Assistants (Partially Done)
Goal: improve seller and buyer productivity with AI.
- [x] Smart search query parsing
- [x] AI description generation ("Magic Write")
- [ ] Harden AI validation, rate limits, and provider failover
- [ ] Build AI Accountant v1 (monthly P&L + export)

## Phase 3: Hybrid Payments (Current Priority)
Goal: support both fiat and crypto checkout under one order lifecycle.
- [ ] SIWE authentication and secure session model
- [ ] Fiat payment adapter (provider abstraction)
- [ ] Crypto escrow reconciliation worker
- [ ] Unified order state machine with idempotency

## Phase 4: Seller Operations
Goal: move from listing UI to full seller operations.
- [ ] Seller analytics dashboard
- [ ] Pricing recommendations and demand insights
- [ ] Listing quality scoring and moderation pipeline

## Phase 5: Reliability and Scale
Goal: production-grade quality, observability, and release safety.
- [ ] CI with lint, typecheck, test gates
- [ ] Critical-path integration + e2e tests
- [ ] Structured logging and error monitoring
- [ ] Performance budgets and caching strategy
