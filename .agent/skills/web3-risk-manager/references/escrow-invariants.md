# Escrow Invariants

1. One order must map deterministically to one payment lifecycle.
2. Payment status cannot be derived only from client-side state.
3. On-chain success must be reconciled into backend order state.
4. Retries must not create duplicate paid orders.
5. Seller payout/release must be tied to explicit state transition.
6. Chain mismatch must block transaction intent before signing.
