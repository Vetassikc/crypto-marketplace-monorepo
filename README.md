# VartMarkt - Next Gen Crypto Marketplace

The "Amazon 3.0" of e-commerce. A decentralized-capable hybrid marketplace combining the trust and speed of Web2 with the freedom and ownership of Web3.

## 🌟 Features

*   **Hybrid Finance:** Pay with Crypto (USDC/ETH) or Fiat.
*   **Aurora UI:** A premium, glassmorphism-based design system with immersive animations.
*   **Smart Escrow:** Trustless transactions secured by smart contracts.
*   **Seller Studio:** Full customizability for shopfronts (Shopify-like freedom).

## 🏗️ Architecture (Monorepo)

*   **`apps/web`**: Next.js 14 (App Router), Tailwind CSS, Framer Motion.
*   **`apps/api`**: NestJS, Prisma, PostgreSQL.
*   **`packages/ui`**: Shared UI components.

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL running locally

### Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start shared services (Database):**
    ```bash
    npx turbo run db:generate --filter=@repo/database
    ```

3.  **Run the development server:**
    ```bash
    npx turbo run dev --filter=web --filter=@repo/api
    ```

    *   Web: `http://localhost:3000`
    *   API: `http://localhost:3333`

## 🛠️ Key Commands

*   `local-setup.sh`: Kills zombie processes and restarts the dev server.
*   `npx turbo run build`: Build all apps.
*   `npx turbo run lint`: Lint all apps.
