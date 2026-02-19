# Marketplace V2 Implementation Plan

Date: February 18, 2026

## 1. Objective
Move the project from MVP prototype to production-capable hybrid marketplace (fiat + crypto) with agent-friendly delivery workflow.

## 2. Delivery Strategy
Work in vertical slices with explicit acceptance criteria and hard quality gates.

### Phase 1: Security Baseline (P0)
1. Introduce SIWE auth flow:
   - `POST /auth/siwe/challenge`
   - `POST /auth/siwe/verify`
2. Replace open CORS with environment allowlist in API bootstrap.
3. Add ownership guards for listing/order mutations.
4. Add secret/config validation for server startup.

Acceptance:
- Address-only login is removed.
- Mutation endpoints require authenticated identity.
- API rejects unauthorized origins.

### Phase 2: Checkout Domain Split (P1)
1. Create checkout orchestration module in API:
   - `CheckoutService`
   - `FiatPaymentProvider` interface
   - `CryptoEscrowProvider` interface
2. Add order state machine transitions:
   - `PENDING -> AUTHORIZED -> PAID -> FULFILLED`
3. Add idempotency key support for order creation/update.

Acceptance:
- Both fiat and crypto checkout paths map to one order lifecycle model.
- Duplicate client retries do not create duplicate orders.

### Phase 3: AI Accountant Foundation (P1/P2)
1. Add accounting models:
   - `LedgerEntry`, `AccountingPeriod`, `Payout`, `Fee`
2. Add ingestion job from orders + on-chain tx data.
3. Deliver report endpoint:
   - `GET /accounting/reports/monthly?sellerId=...`

Acceptance:
- Monthly P&L can be computed deterministically for a seller.
- Report output supports `json` + `csv`.

### Phase 4: Quality & Release Gates (P1)
1. Add CI workflow with staged checks.
2. Standardize scripts in all workspaces:
   - `lint`, `check-types`, `test`, `build`
3. Add minimal test matrix:
   - API integration tests for checkout/auth
   - Web smoke tests for listing + wallet + order flows

Acceptance:
- PRs run deterministic checks.
- Critical user paths are covered by automated tests.

## 3. Technical Decisions
1. Keep monorepo structure as-is (`apps/*`, `packages/*`).
2. Keep Prisma as primary persistence model.
3. Keep escrow integration via dedicated service boundaries.
4. Use env-driven provider configuration for AI and payments.

## 4. Risks and Mitigations
1. Risk: auth retrofit can break existing wallet UX.  
Mitigation: ship SIWE behind feature flag and run A/B internal testing.

2. Risk: fiat integration increases compliance scope.  
Mitigation: start with provider abstraction and sandbox mode only.

3. Risk: on-chain/off-chain order mismatch.  
Mitigation: event reconciliation worker + idempotent updates.

## 5. Execution Tracking
Use:
- `task.md` for checklist progress
- `walkthrough.md` for implementation log and verification evidence
