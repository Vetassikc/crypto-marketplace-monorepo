#!/usr/bin/env bash
set -euo pipefail

WITH_SMOKE="${1:-}"

echo "==> Security scan"
bash scripts/secret-scan.sh

echo "==> Lint"
npm run lint

echo "==> Typecheck"
npm run check-types

echo "==> Build"
npm run build

echo "==> API tests"
npm run test --workspace=@repo/api -- --runInBand

if [[ "${WITH_SMOKE}" == "--with-smoke" ]]; then
  echo "==> Local smoke (requires running web+api)"
  bash scripts/smoke-local.sh
fi

echo "==> Verify complete"
