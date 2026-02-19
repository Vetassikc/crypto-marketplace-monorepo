# TEST_STRATEGY

## Goal
Catch regressions early with fast feedback and clear ownership.

## Test Layers
1. Unit tests
- Validate isolated business logic and utility behavior.

2. Integration tests
- Validate API contracts and database interactions.
- Mandatory for auth, orders, and checkout flows.

3. Smoke tests
- Validate web + backend availability and key routes.
- Use `scripts/smoke-local.sh`.

## Mandatory Commands
- `npm run lint`
- `npm run check-types`
- `npm run build`
- `npm run test --workspace=@repo/api -- --runInBand`
- `bash scripts/secret-scan.sh`

## Current Focus Areas
- Wallet auth and session integrity.
- Order creation and payment state transitions.
- Listing CRUD ownership and authorization.
- AI route abuse resistance and schema validation.
