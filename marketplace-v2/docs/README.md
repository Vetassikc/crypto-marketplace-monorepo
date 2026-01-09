# Marketplace V2: Documentation

Welcome to the official documentation for **Marketplace V2**. This project evolves traditional marketplaces by combining the best practices of Web2 (convenience, speed) and Web3 (transparency, decentralization), powered by Artificial Intelligence (AI).

## 📚 Documentation Structure

### 🚀 Key Modules (Features)
Detailed functional descriptions, usage instructions, and technical implementation:

- **[AI Smart Search](./features/ai-smart-search.md)**: How our NLP search works based on Gemini 2.0.
- **[Magic Write](./features/magic-write.md)**: Content generation for products using computer vision.
- **[Seller Studio](./features/seller-studio.md)** (In Development): Tools for managing your store.

### 🛠 Technical Section
For developers and architects:

- **[System Architecture](./technical/architecture.md)**: Stack overview (Next.js, NestJS, Prisma), databases, and integrations.
- **[Design System (Aurora)](./technical/design-system.md)**: UI construction principles, Aurora theme, components.

## 🏁 Quick Start

### Requirements
- Node.js 18+
- PostgreSQL
- Google Gemini API Key

### Launch
```bash
# Install dependencies
npm install

# Initialize database
npx prisma generate
npx prisma db push

# Start project (Web + API)
npx turbo run dev --filter=web --filter=@repo/api
```
