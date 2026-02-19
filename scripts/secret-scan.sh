#!/usr/bin/env bash
set -euo pipefail

SCAN_HISTORY=0
INCLUDE_LOCAL_ENV=0
WARN_LOCAL_ENV=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --history)
      SCAN_HISTORY=1
      shift
      ;;
    --include-local-env)
      INCLUDE_LOCAL_ENV=1
      shift
      ;;
    --warn-local-env)
      WARN_LOCAL_ENV=1
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: bash scripts/secret-scan.sh [--history] [--include-local-env] [--warn-local-env]"
      exit 2
      ;;
  esac
done

RG_PATTERNS=(
  -e 'sk-or-v1-[A-Za-z0-9]{20,}'
  -e 'sk-(proj|live|test)-[A-Za-z0-9_-]{20,}'
  -e 'sk_(live|test)_[A-Za-z0-9]{20,}'
  -e 'gh[pousr]_[A-Za-z0-9]{20,}'
  -e 'github_pat_[A-Za-z0-9_]{20,}'
  -e 'AIza[0-9A-Za-z_-]{20,}'
  -e 'AKIA[0-9A-Z]{16}'
  -e 'xox[baprs]-[A-Za-z0-9-]{12,}'
  -e '-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----'
)

HISTORY_REGEX='sk-or-v1-[A-Za-z0-9]{20,}|sk-(proj|live|test)-[A-Za-z0-9_-]{20,}|sk_(live|test)_[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{12,}|-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----'

FAIL=0

echo "Scanning tracked files for plaintext secret patterns..."
TRACKED_MATCHES=$(
  git ls-files -z \
    | xargs -0 rg -n --no-heading --color=never "${RG_PATTERNS[@]}" 2>/dev/null \
    || true
)
if [[ -n "$TRACKED_MATCHES" ]]; then
  echo "$TRACKED_MATCHES"
  echo "[FAIL] Potential secret patterns detected in tracked files."
  FAIL=1
fi

TRACKED_ENV_FILES=$(
  git ls-files | rg -n '(^|/)\.env($|\.(local|development|test|production))$' || true
)
if [[ -n "$TRACKED_ENV_FILES" ]]; then
  echo "$TRACKED_ENV_FILES"
  echo "[FAIL] Tracked .env files detected. Keep only .env.example templates."
  FAIL=1
fi

TRACKED_KEY_FILES=$(
  git ls-files | rg -n '(^|/)(id_rsa|id_dsa|id_ed25519)$|(\.pem|\.key|\.p12|\.pfx)$' || true
)
if [[ -n "$TRACKED_KEY_FILES" ]]; then
  echo "$TRACKED_KEY_FILES"
  echo "[FAIL] Tracked private key/certificate files detected."
  FAIL=1
fi

if [[ "$SCAN_HISTORY" -eq 1 ]]; then
  echo "Scanning git history for secret patterns..."
  HISTORY_MATCHES=$(
    for commit in $(git rev-list --all); do
      git grep -n -I -E "$HISTORY_REGEX" "$commit" -- . || true
    done
  )
  if [[ -n "$HISTORY_MATCHES" ]]; then
    echo "$HISTORY_MATCHES"
    echo "[FAIL] Potential secret patterns detected in git history."
    FAIL=1
  fi
fi

if [[ "$INCLUDE_LOCAL_ENV" -eq 1 || "$WARN_LOCAL_ENV" -eq 1 ]]; then
  LOCAL_ENV_FILES=$(
    find . -type f \( \
      -name '.env' -o -name '.env.local' -o -name '.env.development.local' -o -name '.env.test.local' -o -name '.env.production.local' \
    \) \
      -not -path './node_modules/*' \
      -not -path './.next/*' \
      -not -path './dist/*' \
      -print
  )

  if [[ -n "$LOCAL_ENV_FILES" ]]; then
    LOCAL_ENV_MATCHES=$(
      while IFS= read -r file; do
        rg -n --with-filename --no-heading --color=never "${RG_PATTERNS[@]}" "$file" || true
      done <<< "$LOCAL_ENV_FILES"
    )

    if [[ -n "$LOCAL_ENV_MATCHES" ]]; then
      echo "$LOCAL_ENV_MATCHES"
      if [[ "$INCLUDE_LOCAL_ENV" -eq 1 ]]; then
        echo "[FAIL] Potential secrets detected in local .env files."
        FAIL=1
      else
        echo "[WARN] Potential secrets detected in local .env files (not tracked)."
      fi
    fi
  fi
fi

if [[ "$FAIL" -eq 1 ]]; then
  exit 1
fi

echo "[OK] No obvious plaintext secrets detected."
