---
name: web3-risk-manager
description: Validate on-chain/off-chain consistency and transaction safety for Marketplace V2. Use when implementing escrow flows, wallet network handling, transaction indexing, order reconciliation, or smart-contract integration changes.
---

# Web3 Risk Manager

## Overview
Reduce financial and state-consistency risk in blockchain-enabled marketplace flows.

## Workflow
1. Validate chain assumptions:
   - Supported chain IDs
   - Network switching behavior
   - Contract addresses per environment
2. Validate contract interaction safety:
   - Amount precision and conversion
   - Approve + execute sequencing
   - Error handling for rejected transactions
3. Validate reconciliation model:
   - Tx hash persistence
   - Retry/idempotency for backend sync
   - Event-driven status update design
4. Validate user-safety UX:
   - Clear preflight checks (balance, allowance, chain)
   - Non-ambiguous transaction states
   - Recovery paths for failed sync

Load `references/escrow-invariants.md` for invariants before approving changes.
