# Marketplace V2 Task Board

Date initialized: February 18, 2026

## Sprint A: Stabilization & Security
- [x] Remove hardcoded AI provider secret from source code.
- [x] Add environment variable template for web app.
- [ ] Add SIWE-based wallet authentication challenge/verify flow.
- [x] Replace permissive CORS with allowlist by environment.
- [ ] Add backend auth guards for listing/order ownership.
- [ ] Add API rate limiting for AI routes.

## Sprint B: Hybrid Checkout Foundation (Fiat + Crypto)
- [ ] Define checkout orchestration module and state machine.
- [ ] Implement fiat payment adapter interface (provider-agnostic).
- [ ] Implement crypto payment + escrow reconciliation worker.
- [ ] Add idempotent order creation/update endpoints.

## Sprint C: AI Accountant Foundation
- [ ] Define accounting domain schema (entries, categories, wallets, taxes).
- [ ] Add ingestion pipeline for order + tx events.
- [ ] Implement first accountant report: monthly P&L by seller.
- [ ] Add export format (`csv` and `json`) for accounting data.

## Sprint D: Quality & Delivery
- [x] Create CI workflow for lint, typecheck, and tests.
- [ ] Standardize `test` scripts across all packages.
- [ ] Add API integration tests for critical purchase flows.
- [ ] Add smoke e2e tests for wallet login, listing publish, crypto checkout.

## Sprint E: Agent Infrastructure
- [x] Create `security-auditor` skill.
- [x] Create `qa-automation` skill.
- [x] Create `devops-release` skill.
- [x] Create `web3-risk-manager` skill.
- [x] Create `ai-accountant-designer` skill.
- [x] Add explicit `PROJECT_CONTEXT.md`.
- [x] Add explicit `RULES.md`.

## Sprint F: Delivery Operating System
- [x] Add sprint operating model documentation.
- [x] Add sprint plan template.
- [x] Add story/task template.
- [x] Add retrospective template.
- [x] Add PR checklist template.
- [x] Link process docs in `docs/README.md`.

## Sprint G: Practice Alignment Hardening
- [x] Add `scripts/verify.sh` quality gate script.
- [x] Add `scripts/smoke-local.sh` local smoke script.
- [x] Add `scripts/secret-scan.sh` plaintext secret scan.
- [x] Add `SPRINT_PLAYBOOK.md`.
- [x] Add `TASK_TEMPLATE.md`.
- [x] Add `DEFINITION_OF_DONE.md`.
- [x] Add `RELEASE_FLOW.md`.
- [x] Add `TEST_STRATEGY.md`.
- [x] Enforce branch/push discipline in `RULES.md`.

## Backlog Candidates (from best-practice proposals)
- [ ] Add semantic dedupe tuning + anti-spam polish for feed/search flows.
- [ ] Complete i18n coverage (UA/EN keys only, no hardcoded strings).
- [ ] Expand integration tests for queue/reconnect/dedup logic where applicable.
- [ ] Enforce release checklist usage in PR template/process.
- [ ] Add pre-commit security automation (secret scan + dependency audit).
