# PROJECT_CONTEXT

## Product
- Name: VartMarkt (Marketplace V2)
- Type: Hybrid marketplace (fiat + crypto checkout)
- Vision: Premium, AI-assisted, escrow-secured commerce platform

## Monorepo Structure
- `apps/web`: Next.js frontend (marketplace UI, AI routes)
- `apps/api`: NestJS backend (listings, orders, users)
- `packages/database`: Prisma schema/client
- `packages/contracts`: Solidity + Hardhat
- `docs`: architecture, roadmap, specs

## Current Maturity
- Listings and order baseline: implemented
- Wallet-linked user model: implemented
- Smart search + Magic Write: implemented
- Production security hardening: in progress
- Fiat checkout: not implemented yet
- AI accountant: design phase

## Current Priorities
1. SIWE auth and authorization guards
2. Unified checkout domain for fiat + crypto
3. AI accountant data model and reconciliation
4. CI/CD and test automation hardening

## Critical References
- `docs/technical/architecture.md`
- `docs/technical/audit-2026-02-18.md`
- `docs/technical/agentic-development-playbook.md`
- `task.md`
- `implementation_plan.md`
