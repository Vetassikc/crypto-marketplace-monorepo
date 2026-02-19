# Aurora Design System

This document summarizes the current UI system usage and references the canonical token spec.

## 1. Design Direction
- Premium glassmorphism aesthetic
- Dark-first marketplace experience
- Accent gradients for calls-to-action and key states

## 2. Implementation Locations
- Global styles: `apps/web/app/globals.css`
- Tailwind config: `apps/web/tailwind.config.js`
- Core button: `apps/web/components/ui/Button.tsx`
- Aurora background: `apps/web/components/ui/aurora-background.tsx`

## 3. Token Reference
Canonical token and component spec is maintained in:
- `docs/specs/ui-design-system.md`

## 4. Current Gaps
1. Variant consistency drift (`Button` variants used in pages are not always defined).
2. No formal component inventory with status (stable/beta/deprecated).
3. Limited accessibility review and contrast validation.

## 5. Next Actions
1. Create component inventory and ownership matrix.
2. Enforce design token usage via lint or codemod checks.
3. Add accessibility acceptance criteria to UI PR checklist.
