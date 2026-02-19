#!/usr/bin/env bash
set -euo pipefail

echo "Scanning repository for obvious plaintext secret patterns..."

MATCHES=$(rg -n --hidden --no-heading \
  --glob '!node_modules/**' \
  --glob '!**/.next/**' \
  --glob '!_archive/**' \
  --glob '!**/dist/**' \
  --glob '!**/.env*' \
  --glob '!package-lock.json' \
  --glob '!**/package-lock.json' \
  --glob '!**/artifacts/**' \
  -e 'sk-or-v1-[A-Za-z0-9]{20,}' \
  -e 'AIza[0-9A-Za-z_-]{20,}' \
  -e 'AKIA[0-9A-Z]{16}' \
  -e 'xox[baprs]-[A-Za-z0-9-]{12,}' \
  -e '-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----' \
  . || true)

if [[ -n "$MATCHES" ]]; then
  echo "$MATCHES"
  echo "[FAIL] Potential secret patterns detected."
  exit 1
fi

echo "[OK] No obvious plaintext secrets detected."
