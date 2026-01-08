# 🛒 Crypto Marketplace (Hybrid)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black)

A next-generation e-commerce platform bridging the gap between Web2 and Web3. This marketplace enables sellers to list products and accept payments via both **Fiat (Stripe)** and **Crypto (ETH/USDC on Sepolia)**.

---

## 🚀 Key Features

### 🛍️ Hybrid Payment System
- **Fiat Integration:** Seamless card payments using Stripe Payment Intents.
- **Crypto Integration:** Smart contract-based escrow for secure ETH/ERC20 transactions.
- **Seller Onboarding:** Automated Stripe Connect onboarding for fiat payouts.

### 🏢 Marketplace Functionality
- **Dual-Role Accounts:** Users can buy or register as sellers to open stores.
- **Product Management:** Create, edit, and delete listings with image uploads.
- **Store Dashboard:** Real-time metrics, order management, and store configuration.
- **Search & Filtering:** Robust search capability with category-specific attributes.

### 🔐 Security & Tech
- **Authentication:** Wallet-based login (SIWE-ready) with secure session management.
- **Type Safety:** Full TypeScript implementation across Frontend and Backend.
- **Database:** PostgreSQL with Prisma ORM for reliable data integrity.

---

## 🏗️ Project Structure

This project follows a **Monorepo** architecture:

```bash
Crypto-Marketplace/
├── marketplace-server/      # 🔙 Backend (Express, Prisma, PostgreSQL)
│   ├── src/routes/          # Modular API routes with auth protection
│   ├── src/middleware/      # Security & Error handling middleware
│   └── prisma/              # Database schema and migrations
├── my-crypto-marketplace/   # ⚛️ Frontend (React, MUI, Ethers.js)
│   ├── src/context/         # Global state (Wallet, User)
│   ├── src/api/             # Typed API Client
│   └── src/contracts/       # Smart Contract ABIs
└── marketplace-contracts/   # 🔗 Blockchain (Hardhat, Solidity)
    ├── contracts/           # Marketplace smart contracts
    └── test/                # Unit tests for solidity
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Material-UI (MUI), Ethers.js v6
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL, Prisma ORM
- **Blockchain:** Hardhat, Solidity, Sepolia Testnet
- **DevOps:** Docker (optional), Shell Scripts

---

## ⚡ Quick Start

You can spin up the entire development environment (Database, Backend, Frontend) with a single command.

### Prerequisites
- Node.js (v18+)
- Docker (for local PostgreSQL)
- MetaMask extension installed

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vetassikc/crypto-marketplace-monorepo.git
   cd crypto-marketplace-monorepo
   ```

2. **Run the Quickstart script:**
   ```bash
   ./quickstart.sh
   ```
   *This script checks dependencies, starts PostgreSQL via Docker (if needed), runs migrations, and launches both servers.*

3. **Access the App:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

---

## ⚙️ Environment Variables

The project uses `.env` files for configuration. The `quickstart.sh` script automatically creates them from examples.

**Key Variables Needed:**
- `DATABASE_URL` (PostgreSQL connection string)
- `STRIPE_SECRET_KEY` & `STRIPE_PUBLISHABLE_KEY` (from Stripe Dashboard)
- `REACT_APP_CONTRACT_ADDRESS` (Deployed Marketplace contract address)

---

## 🗺️ Roadmap

- [x] **Phase 1:** Core Marketplace logic, DB Schema, Basic Frontend.
- [x] **Phase 2:** Stripe Connect integration for fiat payments.
- [x] **Phase 3:** TypeScript migration & Backend Security (Auth).
- [ ] **Phase 4:** Smart Contract integration (Sepolia) & USDC Support.
- [ ] **Phase 5:** Deployment to Cloud (AWS/GCP/Vercel).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
