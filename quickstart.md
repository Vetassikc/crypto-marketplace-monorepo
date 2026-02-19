# 🚀 Crypto Marketplace - Quick Start Guide

## Prerequisites
- **Node.js**: v18 or v20 (LTS recommended)
- **npm**: v10+
- **Docker**: For running PostgreSQL (optional if using local Postgres)

## ⚡ Quick Start

```bash
# 1. Install Dependencies (Root)
npm install

# 2. Environment Setup
# Configure apps/web/.env.local from apps/web/.env.example

# 3. Database Setup
# Ensure apps/api/.env has correct DATABASE_URL
npx turbo run db:generate
npx turbo run db:push

# 4. Start Development Server (Monorepo)
npx turbo run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `npx prisma studio` (Run in `packages/database`)

## 📁 Project Structure

```
Marketplace/
├── apps/
│   ├── web/                # Next.js Frontend
│   └── api/                # NestJS Backend
├── packages/
│   ├── database/           # Prisma Generic Package
│   └── ui/                 # Shared UI Components
├── quickstart.sh           # Legacy script
└── turbo.json             # Turborepo Config
```
