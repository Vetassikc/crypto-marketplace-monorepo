# Sprint Operating Model

## 1. Cadence
- Sprint length: 1 week.
- Planning: Monday (60-90 min).
- Mid-sprint sync: Wednesday (30 min).
- Demo + Retro: Friday (45-60 min).
- Release window: Friday after quality gates pass.

## 2. Backlog Hierarchy
1. Epic (business outcome)
2. Story (user value slice)
3. Task (implementation unit)
4. Sub-task (optional, technical decomposition)

## 3. Required Sprint Artifacts
- `task.md`: live sprint checklist and status.
- `implementation_plan.md`: technical blueprint for current objective.
- `walkthrough.md`: what was implemented and how it was verified.
- `CHANGELOG.md`: user-visible changes and important technical updates.

## 4. Definition of Ready (DoR)
A story enters sprint only if:
1. Problem statement is clear.
2. Acceptance criteria are testable.
3. Dependencies are identified.
4. Owner is assigned.
5. Estimated effort exists (S/M/L or story points).

## 5. Definition of Done (DoD)
A task/story is done only if:
1. Code implemented and reviewed.
2. `lint`, `check-types`, tests, and build pass.
3. Security checks applied for auth/payment/AI surfaces.
4. Documentation updated (`docs/*` + root artifacts if needed).
5. Verification steps recorded in `walkthrough.md`.

## 6. Standard Delivery Flow
1. Plan sprint scope and lock priorities.
2. Implement in small vertical slices.
3. Run automated checks.
4. Update docs professionally (architecture/process/feature docs).
5. Update changelog and walkthrough evidence.
6. Open PR (or prepare push) only after all gates are green.

## 7. Branch and PR Policy
- Branch naming: `codex/<sprint>-<short-topic>`.
- Prefer small PRs (single concern).
- PR must include:
  - Scope summary
  - Risk notes
  - Test evidence
  - Docs updated list

## 8. Quality Gates (Minimum)
- `npm run lint`
- `npm run check-types`
- `npm run build`
- Scope tests (API/Web as applicable)

## 9. Sprint Health Metrics
- Planned vs completed stories
- Defect leakage (bugs found after merge)
- Rework rate
- Lead time from task start to merged

## 10. Anti-Patterns to Avoid
- Starting implementation without acceptance criteria.
- Big-bang PRs with mixed concerns.
- Shipping feature changes without docs update.
- Marking done with warnings/errors ignored and undocumented.
