# RELEASE_FLOW

## Branch and Commit Discipline
- Branch format: `codex/sprint-XX-task-name`.
- Keep commits atomic: one logical change per commit.
- Do not push directly to `main`.

## Pre-Merge Flow
1. Run verify:
   - `bash scripts/verify.sh`
2. Run smoke for runtime changes:
   - `bash scripts/smoke-local.sh`
3. Complete PR checklist and docs updates.
4. Add short release note.

## Merge and Push
1. Merge only after all mandatory checks pass.
2. Tag release candidate if needed.
3. Publish release notes/changelog entry.

## Post-Release
1. Monitor health and error rates.
2. Validate critical user journeys.
3. If needed, execute rollback plan.
