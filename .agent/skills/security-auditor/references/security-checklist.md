# Security Checklist

## Critical
- No hardcoded secrets in source.
- No wildcard CORS in production paths.
- Sensitive endpoints require authenticated identity.
- Ownership checks exist for resource mutation.

## Auth
- SIWE or equivalent wallet signature flow for wallet login.
- Session/token lifetime and invalidation are defined.
- Privileged roles are enforced server-side.

## API
- DTO/schema validation at input boundaries.
- Reject malformed LLM output with strict parsing.
- Add rate limits and abuse protection for AI routes.

## Payments
- Order creation/update endpoints are idempotent.
- On-chain and off-chain states are reconciled.
- Do not trust client-provided payment status.

## Logging/Monitoring
- Errors are logged without leaking secrets.
- Security-sensitive events are auditable.
