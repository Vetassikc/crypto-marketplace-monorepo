# Marketplace V2 Documentation

This folder is the main documentation source for architecture, product modules, and execution process.

## Documentation Map

### Feature Docs
- [AI Smart Search](./features/ai-smart-search.md)
- [Magic Write](./features/magic-write.md)
- [Seller Studio](./features/seller-studio.md)

### Technical Docs
- [Architecture (Current + Target)](./technical/architecture.md)
- [Technical Audit (2026-02-18)](./technical/audit-2026-02-18.md)
- [Agentic Development Playbook](./technical/agentic-development-playbook.md)
- [Design System](./technical/design-system.md)
- [Database Schema Spec](./specs/database-schema.md)

### Process Docs
- [Sprint Operating Model](./process/sprint-operating-model.md)
- [SPRINT_PLAYBOOK](./process/SPRINT_PLAYBOOK.md)
- [TASK_TEMPLATE](./process/TASK_TEMPLATE.md)
- [DEFINITION_OF_DONE](./process/DEFINITION_OF_DONE.md)
- [RELEASE_FLOW](./process/RELEASE_FLOW.md)
- [TEST_STRATEGY](./process/TEST_STRATEGY.md)
- [Sprint Plan Template](./process/templates/sprint-plan-template.md)
- [Story/Task Template](./process/templates/story-task-template.md)
- [Retro Template](./process/templates/retrospective-template.md)
- [PR Checklist Template](./process/templates/pr-checklist-template.md)

### Planning Artifacts (repo root)
- `task.md`
- `implementation_plan.md`
- `walkthrough.md`

## Quick Start (Monorepo)

### Requirements
- Node.js 18+
- npm 10+
- PostgreSQL (local or Docker)

### Launch
```bash
npm install
npx turbo run db:generate --filter=@repo/database
npx turbo run db:push --filter=@repo/database
npx turbo run dev --filter=web --filter=@repo/api
```

### Environment
- Web template: `apps/web/.env.example`
- API template: `apps/api/.env.example`
