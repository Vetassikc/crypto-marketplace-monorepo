---
name: qa-automation
description: Build and maintain automated quality gates for Marketplace V2. Use when adding tests, defining regression suites, creating CI checks, validating release readiness, or converting manual test flows into repeatable automation.
---

# QA Automation

## Overview
Create reliable automated checks with clear scope, minimal flakiness, and direct mapping to user-critical flows.

## Workflow
1. Identify critical paths first:
   - Wallet login
   - Listing create/edit/delete
   - Checkout (crypto/fiat)
   - Order visibility and status
2. Define test pyramid:
   - Unit: isolated logic
   - Integration: API + database contracts
   - E2E smoke: top user journeys
3. Add deterministic checks to CI:
   - lint
   - typecheck
   - tests
   - build
4. Enforce failure clarity:
   - Stable test names
   - Actionable failure messages
   - Minimal mock overuse for critical flows
5. Produce release checklist:
   - Must-pass gates
   - Known warnings/deviations

Load `references/test-matrix.md` when adding or reviewing test coverage.
