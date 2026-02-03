# Professional Restructuring Plan

## Goal
Transform the chaotic, nested folder structure into a standard **Tier-1 Tech Company Monorepo**.
No more `marketplace-v2` subfolder. The root of the repository *IS* the project.

## Current vs Target
| Current | Target |
| :--- | :--- |
| `/marketplace-v2/apps` | `/apps` |
| `/marketplace-v2/packages` | `/packages` |
| `/marketplace-server` | `/_archive/marketplace-server` |
| `/marketplace-contracts` | `/packages/contracts` (Integrated) |
| `/docs` (Split) | `/docs` (Unified) |

## Execution Steps

### Phase 1: Archiving & Cleanup
1.  Create `_archive/legacy_root` for loose files (`.log`, `.mp4`).
2.  Move `marketplace-server` and `my-crypto-marketplace` to `_archive`.
3.  Move root `docs` to `_archive/docs_old` (we rely on v2 docs).

### Phase 2: Integration
1.  Move `marketplace-contracts` to `marketplace-v2/packages/contracts`.
2.  Create `package.json` for contracts if missing, to make it a workspace.

### Phase 3: Hoisting (The Big Move)
1.  Move contents of `marketplace-v2/*` to `.` (Root).
2.  Move `.agent` and `gemini.md` are already in root (ensure they stay).
3.  Delete empty `marketplace-v2` folder.

### Phase 4: Configuration Fixes
1.  Update `quickstart.sh` (remove `cd marketplace-v2`).
2.  Update `turbo.json` (if needed).
3.  Verify `pnpm-workspace.yaml` or `package.json` workspaces.

### Phase 5: Verification
1.  `npm install` at structure root.
2.  `turbo run build`.
