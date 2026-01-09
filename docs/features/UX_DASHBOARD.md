# 👤 Feature: User Experience & Dashboard

## Overview
The UX is designed to feel like a "Premium SaaS" rather than a clunky dApp. We prioritize visuals, smooth transitions, and intuitive state management.

## 🌗 "Premium Midnight" Theme
A custom-built design system enforcing a rich, deep aesthetic.

- **Palette**:
  - `Background`: Deep Navy (`#0b0d14` / `hsl(230 35% 7%)`) - Reduces eye strain, feels expensive.
  - `Card`: Slightly lighter navy with glassmorphism (`backdrop-filter: blur`).
  - `Primary`: Vibrant Blue/Purple gradients for non-intrusive calls to action.
- **Technology**: 
  - Tailwind CSS for utility-first styling.
  - Dynamic Material-UI (MUI) theme syncing to ensure component libraries match the custom CSS.

## 🎛 User Dashboard
A central hub for managing digital identity and assets.

### Sections
1. **My Collection**: Grid view of all assets currently owned by the user.
   - *Tech*: Queries Blockchain/DB where `owner == currentUser`.
2. **Listings**: Assets created and listed for sale.
   - *Tech*: Queries where `seller == currentUser` AND `sold == false`.
3. **Sales History**: Historical record of sold items.
   - *Tech*: Aggregated from `ProductPurchased` events.

## 💼 Wallet Management (`WalletContext`)
- **Auto-Detection**: Instantly recognizes injected providers (MetaMask, Rabby).
- **Network Guard**: Automatically prompts users to switch to **Tempo Testnet** (Chain ID 42429) if they are on the wrong network.
- **State Persistence**: Remembers connection state across page reloads.
