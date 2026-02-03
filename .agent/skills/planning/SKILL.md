---
name: Planning with Files
description: A systematic workflow using persistent markdown files (Plan, Act, Log) for complex tasks.
---

# Planning with Files Skill

## Philosophy
For complex tasks, we do not just "jump into code". We plan, we execute, and we document. This reduces errors and keeps the context clear.

## The 3-File Pattern
1.  **task.md** (The Checklist):
    - High-level list of TODOs.
    - Status tracking (`[ ]`, `[/]`, `[x]`).
2.  **implementation_plan.md** (The Blueprint):
    - Detailed technical design.
    - File changes, API signatures, logic flows.
3.  **walkthrough.md** (The Proof):
    - What was done.
    - How to verify it (test steps).

## Workflow Rules
1.  **Plan First**: Before writing code, update `implementation_plan.md`.
2.  **Track Progress**: update `task.md` *during* the work, not just at the end.
3.  **Review**: Ask the user to review the plan if the task is large (PredictedTaskSize > 5).
4.  **Log Errors**: If something fails, document it in `task.md` as a sub-item or note to avoid repeating it.

## When to Use
- New Feature Development.
- Major Refactoring.
- Complex Bug Fixes.
- NOT for: Simple typos, one-line fixes.
