# 🗺️ Marketplace V2: Strategic Roadmap

This document outlines the strategic vision and development path for Marketplace V2. It is designed to be executed in **Sprints**.

## 🎯 Phase 1: Foundation (Completed) ✅
**Goal:** Establish a robust monorepo, database, and basic UI.
- [x] Monorepo Setup (TurboRepo)
- [x] Database Schema (User, Listing, Order)
- [x] Basic Auth and User Profile
- [x] Listing CRUD (Create, Read, Update, Delete)

## 🧠 Phase 2: AI Core (Completed) ✅
**Goal:** Integrate AI to differentiate the product.
- [x] **Smart Search**: Natural language to SQL query (Gemini 2.0).
- [x] **Magic Write**: AI-generated product descriptions from images.
- [x] **Professional Documentation**: Full English documentation suite.

---

## 🔗 Phase 3: Web3 & Trust (Current Focus) 🚧
**Goal:** Introduce blockchain features for transparency and secure payments.

### Sprint 7: Wallet Connect & Identity
- [ ] Integrate **RainbowKit** / **Wagmi** for wallet connection.
- [ ] Wallet-based Login (SIWE - Sign In With Ethereum).
- [ ] Link Wallet to User Profile.

### Sprint 8: Smart Contracts & Payments
- [ ] Deploy Escrow Smart Contract (Solidity/Hardhat).
- [ ] Implement "Pay with Crypto" checkout flow.
- [ ] Transaction History indexing (The Graph or simple RPC fetch).

---

## 📣 Phase 4: Social & Engagement (Upcoming) 🔮
**Goal:** Build a community around the marketplace.

### Sprint 9: Seller Studio & Analytics
- [ ] Dashboard for Sellers (Views, Sales, Revenue).
- [ ] AI-powered Pricing Suggestions (based on market data).

### Sprint 10: Social Features
- [ ] User Reviews & Ratings.
- [ ] "Ask Seller" Chat System (Real-time with Socket.io).
- [ ] Wishlists & Collections.

---

## 📱 Phase 5: Scaling & Ecosystem (Future) 🔭
**Goal:** Scale to millions of users and mobile platforms.

### Sprint 11: Performance & SEO
- [ ] SSR Optimization & caching strategies.
- [ ] Advanced SEO (Schema.org for products).
- [ ] Image Optimization (Next/Image + CDN).

### Sprint 12: Mobile App
- [ ] React Native / Expo implementation (sharing logic with Web).
- [ ] Push Notifications.

---

## 🛠 Technical Debt & Maintenance
*To be addressed continuously:*
- **Testing**: Implementation of Cypress (E2E) and Jest (Unit).
- **Security**: Weekly dependency audits.
- **Refactoring**: Periodic code cleanups and component abstraction.
