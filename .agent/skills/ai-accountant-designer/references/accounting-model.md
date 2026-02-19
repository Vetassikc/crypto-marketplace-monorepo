# Accounting Model (MVP)

## Core Tables
- `ledger_entries`
  - `id`, `seller_id`, `order_id`, `entry_type`, `amount`, `currency`, `source`, `occurred_at`
- `fees`
  - `id`, `order_id`, `fee_type`, `amount`, `currency`
- `payouts`
  - `id`, `seller_id`, `period_start`, `period_end`, `amount`, `status`

## Entry Types
- `SALE_GROSS`
- `PLATFORM_FEE`
- `PAYMENT_FEE`
- `REFUND`
- `PAYOUT`

## Reconciliation Rule
Canonical order/accounting state must be derived from persisted events and deterministic transforms, not from raw AI output.
