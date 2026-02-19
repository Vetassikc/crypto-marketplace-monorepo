# Agentic Development Playbook

## 1. Goal
Enable reliable multi-agent delivery for Marketplace V2 with clear handoffs, traceability, and quality gates.

## 2. Core Operating Loop
1. **Plan**  
Update `task.md` and `implementation_plan.md` before coding.
2. **Execute**  
Implement in small vertical slices (API + UI + docs when required).
3. **Validate**  
Run lint/typecheck/tests for touched scope.
4. **Document**  
Write delivery notes in `walkthrough.md`.

## 3. Mandatory Artifacts
- `task.md`: sprint checklist and status tracking
- `implementation_plan.md`: technical blueprint for current objective
- `walkthrough.md`: execution log + verification notes

## 4. Suggested Agent Roles
1. **Product Agent**  
Owns user stories, acceptance criteria, and priority.
2. **Architect Agent**  
Owns domain boundaries, contracts, and design decisions.
3. **Backend Agent**  
Owns NestJS modules, Prisma schema, API guarantees.
4. **Frontend Agent**  
Owns Next.js UX and checkout/client orchestration.
5. **Web3 Agent**  
Owns smart contracts, wallet flows, on-chain/off-chain consistency.
6. **Security Agent**  
Owns auth, secret handling, abuse prevention, threat checks.
7. **QA Agent**  
Owns test plan, regression checks, and release validation.

## 5. Existing Local Skills in Repository
- `.agent/skills/architect/SKILL.md`
- `.agent/skills/planning/SKILL.md`
- `.agent/skills/product-manager/SKILL.md`
- `.agent/skills/ui-ux-pro/SKILL.md`

## 6. Recommended Next Skills to Add
1. `security-auditor`  
Checklist for auth, CORS, secret management, and payment safety.
2. `qa-automation`  
Defines contract tests, e2e smoke flows, and regression matrix.
3. `devops-release`  
CI/CD pipelines, environment promotion, and rollback procedure.
4. `web3-risk-manager`  
Escrow lifecycle invariants, chain switch handling, tx reconciliation.
5. `ai-accountant-designer`  
Ledger schema, reconciliation logic, and report export contracts.

## 7. Definition of Done (Per Task)
- Feature behavior matches acceptance criteria
- No secrets in code
- Lint/typecheck pass for touched scope
- Relevant tests added or updated
- Docs updated in `docs/`
- `walkthrough.md` includes verification steps and results
