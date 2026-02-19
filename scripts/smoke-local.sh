#!/usr/bin/env bash
set -euo pipefail

WEB_URL="${WEB_URL:-http://localhost:3000}"
API_URL="${API_URL:-http://localhost:3001}"

check() {
  local name="$1"
  local url="$2"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
  if [[ "$code" != "200" ]]; then
    echo "[FAIL] ${name}: ${url} -> ${code}"
    exit 1
  fi
  echo "[OK] ${name}: ${url}"
}

echo "Running smoke checks..."
check "API status" "${API_URL}/status"
check "Web home" "${WEB_URL}"
check "Web listings" "${WEB_URL}/listings"

echo "Smoke checks passed."
