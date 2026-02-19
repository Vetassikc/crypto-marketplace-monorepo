# PR Checklist Template

## Scope
- [ ] PR has single clear purpose.
- [ ] Risky changes are explicitly described.

## Quality
- [ ] `npm run lint` passed.
- [ ] `npm run check-types` passed.
- [ ] Relevant tests passed.
- [ ] `npm run build` passed (or warnings documented).

## Security
- [ ] No secrets added.
- [ ] Auth/authz implications reviewed.
- [ ] Payment/transaction implications reviewed (if applicable).

## Documentation
- [ ] Feature/process docs updated.
- [ ] `walkthrough.md` updated with verification evidence.
- [ ] `CHANGELOG.md` updated if user-facing behavior changed.
