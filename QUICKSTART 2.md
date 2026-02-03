# 🚀 Quickstart Guide: Marketplace V2

This guide will help you set up and run the Marketplace V2 monorepo locally.

## Prerequisites
- **Node.js**: v18 or v20 (LTS recommended)
- **npm**: v10+
- **Docker**: For running the PostgreSQL database (optional if you have local Postgres)
- **Git**: For version control

## ⚡️ The Fast Way (script)
We have a script that automates dependencies and startup:

```bash
./quickstart.sh
```

## 🛠 Manual Setup

If you prefer to run commands manually or need to debug:

### 1. Install Dependencies
Install packages for the entire monorepo:
```bash
cd marketplace-v2
npm install
```

### 2. Environment Setup
Ensure you have `.env.local` in `apps/web` and `.env` in `apps/api` (or root).
Required variables:
- `DATABASE_URL` (PostgreSQL connection string)
- `GOOGLE_GENERATIVE_AI_API_KEY` (For AI features)

### 3. Database Migration
Update your local database schema:
```bash
npx turbo run db:generate
npx turbo run db:push
```

### 4. Start Development Server
Run both Frontend (Web) and Backend (API) simultaneously:
```bash
npx turbo run dev --filter=web --filter=@repo/api
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `npx prisma studio` (http://localhost:5555)
