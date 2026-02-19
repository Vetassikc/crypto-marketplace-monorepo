---
name: security-auditor
description: Run a practical security review for Marketplace V2 services and web flows. Use when implementing or reviewing authentication, authorization, payments, secrets, AI routes, CORS, rate limiting, wallet flows, or any endpoint that processes user funds or personal data.
---

# Security Auditor

## Overview
Perform a fast, high-signal security pass and produce actionable fixes with file-level evidence.

## Workflow
1. Identify trust boundaries:
   - Client vs server
   - API vs database
   - Off-chain vs on-chain
2. Check secret handling:
   - No hardcoded keys
   - Env templates exist
   - Sensitive values are not logged
3. Check authn/authz:
   - Verify identity mechanism (SIWE/session/JWT)
   - Verify resource ownership checks
   - Verify role-based access for privileged actions
4. Check API hardening:
   - CORS allowlist by environment
   - Input validation at boundary
   - Rate limiting for abuse-prone routes
5. Check payment/transaction safety:
   - Idempotency for order/payment endpoints
   - Transaction status reconciliation
   - No trust in client-only status
6. Produce findings ordered by severity:
   - P0: immediate exploit risk
   - P1: high risk/abuse path
   - P2: hardening debt

## Output Format
Use:
- Summary of posture
- Findings with `file:line`
- Fix plan with smallest safe steps

Load `references/security-checklist.md` before finalizing findings.
