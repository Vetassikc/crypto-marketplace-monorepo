# RULES

## Engineering Rules
1. Never commit secrets or private keys.
2. Validate all external input at API boundaries.
3. Enforce server-side authorization for all mutations.
4. Keep checkout and payment operations idempotent.
5. Update docs when architecture or behavior changes.

## Agent Workflow Rules
1. Plan first: update `task.md` and `implementation_plan.md`.
2. Execute in small, reviewable increments.
3. Validate touched scope with lint/typecheck/tests/build.
4. Update docs after implementation and tests, before PR/push.
5. Log verification and results in `walkthrough.md`.
6. Follow task format from `docs/process/TASK_TEMPLATE.md`.

## Code Quality Rules
1. Keep strict typing and avoid `any` unless justified.
2. Prefer reusable modules over duplicate logic.
3. Keep UI responsive for mobile and desktop.
4. Preserve existing design language unless intentionally reworked.

## Release Rules
1. No merge without passing quality gates.
2. Track warnings explicitly if not fixed in same change.
3. Document rollback considerations for risky changes.
4. Follow `docs/process/sprint-operating-model.md` for sprint cadence and DoD.
5. Branch naming: `codex/sprint-XX-task-name`.
6. Never push directly to `main`; merge only after verify + docs + checklist.
