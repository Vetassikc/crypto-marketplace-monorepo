---
name: ai-accountant-designer
description: Design the AI Accountant domain for Marketplace V2. Use when modeling accounting data, reconciliation jobs, tax/report outputs, seller P&L analytics, and AI-assisted bookkeeping workflows.
---

# AI Accountant Designer

## Overview
Define accounting-grade data contracts and workflows so AI features produce auditable outputs, not generic text.

## Workflow
1. Define accounting entities:
   - LedgerEntry
   - Fee
   - Payout
   - AccountingPeriod
2. Define event ingestion:
   - Order events
   - Payment provider events
   - On-chain settlement events
3. Define reconciliation rules:
   - Source-of-truth priority
   - Late event handling
   - Correction/amendment model
4. Define report contracts:
   - Monthly P&L
   - Seller cashflow summary
   - Export schema (`csv`, `json`)
5. Define AI layer boundaries:
   - AI can classify/summarize
   - AI cannot mutate canonical ledger without deterministic rules

Load `references/accounting-model.md` before proposing schema or API changes.
