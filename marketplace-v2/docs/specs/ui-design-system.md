# UI Design System Specification

## Overview
The "Amazon 3.0" UI is built on a "Premium Glassmorphism" aesthetic, utilizing dark modes, subtle gradients, and sophisticated blur effects to create a feeling of depth and modern luxury.

## Core Stack
*   **Framework:** Tailwind CSS v3.4+
*   **Animation:** Framer Motion (To be added)
*   **Icons:** Lucide React (To be added)
*   **Utils:** `clsx` + `tailwind-merge` for class management.

## Design Tokens

### Colors
Defined in `tailwind.config.js`.

| Token | Scimitar | Hex | Usage |
| :--- | :--- | :--- | :--- |
| `brand-500` | Primary Blue | `#0ea5e9` | Main actions, highlights |
| `brand-900` | Deep Blue | `#0c4a6e` | Backgrounds, heavy accents |
| `dark-bg` | Obsidian | `#0a0a0a` | Main page background |
| `dark-card` | Charcoal | `#121212` | Cards, modals |

### Effects
*   **Glass:** `bg-white/10 backdrop-blur-md border border-white/20`
*   **Glow:** `shadow-[0_0_20px_rgba(14,165,233,0.3)]`

## Components

### Button
Located at: `components/ui/Button.tsx`

**Variants:**
*   `default`: Solid brand color with glow.
*   `outline`: Glass effect with border.
*   `ghost`: Transparent, hover effect only.
*   `glass`: Special glassmorphism variant.

**Usage:**
```tsx
<Button variant="default" size="lg">Buy Now</Button>
<Button variant="glass">Connect Wallet</Button>
```
