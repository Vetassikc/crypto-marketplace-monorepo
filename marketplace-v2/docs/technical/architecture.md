# Marketplace V2: Technical Architecture

## 1. General Overview
Marketplace V2 is built on a modern **Monorepo** architecture using **TurboRepo** for package and process management. This ensures a unified code standard, shared types (TypeScript interfaces), and fast builds.

## 2. Tech Stack

### Frontend (`apps/web`)
*   **Framework:** Next.js 14+ (App Router).
*   **Styling:** Tailwind CSS + Custom Design System ("Aurora Theme").
*   **State Management:** React Query (TanStack Query) — for server state and caching.
*   **Context API:** for local UI state (SearchContext).

### Backend (`apps/api`)
*   **Framework:** NestJS.
*   **Architecture:** Modular (ListingsModule, OrdersModule).
*   **ORM:** Prisma.
*   **Database:** PostgreSQL.

### AI Integration
*   **SDK:** Vercel AI SDK (`ai`, `@ai-sdk/google`).
*   **Provider:** Google Gemini API.

## 3. Data Schema (Prisma Schema)

Key models:
*   `Listing`: Product (title, description, price, relation to seller).
*   `User`: Platform user.
*   `Order`: Order (Buyer <-> Listing relation).

## 4. Design System "Aurora"
We are moving away from standard Material Design or Bootstrap towards a custom, premium look.
*   **Glassmorphism:** Active use of `backdrop-blur` and semi-transparent backgrounds.
*   **Gradients:** Use of complex gradients for accents (buttons, active states).
*   **Dark Mode:** Interface optimized for dark theme by default.
