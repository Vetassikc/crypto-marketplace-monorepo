# Marketplace API

Backend service for Marketplace V2 built with NestJS + Prisma.

## Local Run
```bash
npm run dev
```

Default local URL: `http://localhost:3001`

## Environment
Required local variable:
- `DATABASE_URL` in `apps/api/.env`

## Main Modules
- `listings`: listing CRUD and search filters
- `orders`: order creation and retrieval
- `users`: wallet-linked user bootstrap

## Important Note
This API currently needs security hardening before production:
- SIWE authentication
- ownership/role guards
- restrictive CORS allowlist
