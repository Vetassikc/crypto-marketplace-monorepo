# DEFINITION_OF_DONE

A task/story is done only if all checks below are satisfied.

## Engineering
- [ ] Code is implemented and reviewed.
- [ ] No plaintext secrets in tracked files.
- [ ] Security implications reviewed.

## Verification
- [ ] `bash scripts/verify.sh` passed.
- [ ] Local smoke passed (`bash scripts/smoke-local.sh`) when runtime behavior changed.

## Documentation
- [ ] Feature/API/behavior docs updated.
- [ ] Runbook/process docs updated if needed.
- [ ] `walkthrough.md` updated with verification evidence.
- [ ] `CHANGELOG.md` updated for user-visible changes.

## Release Readiness
- [ ] Short release note prepared.
- [ ] Rollback notes added for risky changes.
