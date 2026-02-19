# Test Matrix

## API Integration (Required)
- `POST /users/login` (later SIWE verify flow)
- `POST /listings`, `PATCH /listings/:id`, `DELETE /listings/:id`
- `POST /orders`, `GET /orders`, `GET /orders/:id`

## Web Smoke (Required)
- Connect wallet
- Publish listing
- Open listing details
- Complete crypto checkout happy path (or guarded fail path)

## Release Gates
- Lint: pass with zero blocking issues.
- Typecheck: pass.
- Build: pass (warnings explicitly tracked).
- API tests: pass.
