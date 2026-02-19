---
name: devops-release
description: Define and operationalize CI/CD and release controls for Marketplace V2. Use when creating GitHub Actions, deployment gates, environment promotion rules, rollback procedures, and release observability.
---

# DevOps Release

## Overview
Turn repository health checks into predictable release gates and safe deployment workflow.

## Workflow
1. Create CI baseline:
   - Run lint, typecheck, tests, build on pull requests
2. Define environment strategy:
   - Local, staging, production
   - Clear env variable ownership
3. Add release gates:
   - No merge on failed quality checks
   - Track and approve known warnings explicitly
4. Define rollback:
   - Fast revert path
   - Data migration rollback notes
5. Add observability hooks:
   - Error reporting
   - Request/latency baselines

## Output
- CI workflow file(s)
- Release checklist
- Rollback checklist

Load `references/release-checklist.md` before finalizing.
