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

## One-Command Public Setup
Use this only when you are ready to make the repository public and enforce branch protection via GitHub API:

1. Create a temporary token with repo admin permissions.
2. Run:
   - `GITHUB_TOKEN=... bash scripts/github/go-public-and-protect.sh`
3. Optional overrides:
   - `OWNER=... REPO=... BRANCH=main RUN_VERIFY=1 REQUIRED_CHECKS_CSV="CI / secret-scan,CI / lint,CI / typecheck,CI / build,CI / api-tests" bash scripts/github/go-public-and-protect.sh`

The script performs:
- secret scan on tracked files + git history;
- optional `verify` gate run;
- repository visibility switch to public;
- branch protection setup with required checks.
