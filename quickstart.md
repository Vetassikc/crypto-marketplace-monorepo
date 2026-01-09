# 🚀 Crypto Marketplace - Quick Start Guide

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| npm | 8+ |
| PostgreSQL | Running on port 5432 |
| Docker | Optional (for local PostgreSQL) |

---

## ⚡ One-Command Start

```bash
cd /Users/vitaliiradionov/Desktop/Marketplace
./quickstart.sh
```

**Options:**
| Flag | Description |
|------|-------------|
| `--fresh` | Clean install (removes node_modules) |
| `--db-only` | Only start PostgreSQL |
| `--skip-db` | Skip database check |

---

## 🔧 Manual Setup

### 1. Database

**Option A: Already have PostgreSQL running?**
```bash
# Verify it's running
lsof -i :5432
# If running, skip to step 2
```

**Option B: Start with Docker**
```bash
docker compose up -d postgres
```

### 2. Backend

```bash
cd marketplace-server
npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate deploy
npm run dev
```
→ Runs on http://localhost:3001

### 3. Frontend

```bash
cd my-crypto-marketplace
npm install --legacy-peer-deps
npm start
```
→ Opens http://localhost:3000

---

## 🛠️ Useful Commands

| Task | Command |
|------|---------|
| View database | `cd marketplace-server && npx prisma studio` |
| Run contract tests | `cd marketplace-contracts && npx hardhat test` |
| Deploy contract | `cd marketplace-contracts && npx hardhat run scripts/deploy.js --network sepolia` |
| Check ports | `lsof -i :3000 && lsof -i :3001` |
| Kill port 3000 | `lsof -ti:3000 \| xargs kill -9` |

---

## 📁 Project Structure

```
Marketplace/
├── marketplace-server/      # Backend (Express + Prisma)
├── marketplace-contracts/   # Smart Contracts (Hardhat)
├── my-crypto-marketplace/   # Frontend (React)
├── docker-compose.yml       # PostgreSQL container
├── quickstart.sh           # Auto-start script
└── PROJECT_CONTEXT.md      # Full documentation
```

---

## 🔑 Environment Variables

**Backend** (`marketplace-server/.env`):
```env
DATABASE_URL="postgresql://postgres:54irimez@localhost:5432/marketplace"
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`my-crypto-marketplace/.env`):
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_CONTRACT_ADDRESS=0x...
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` |
| Port 5432 in use | You have PostgreSQL running - that's good! |
| Cannot GET / | Frontend not running, run `npm start` in `my-crypto-marketplace` |
| Prisma errors | Run `npx prisma generate` then `npx prisma migrate deploy` |
