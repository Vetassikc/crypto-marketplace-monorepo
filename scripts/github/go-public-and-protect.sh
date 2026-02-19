#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install jq and retry."
  exit 1
fi

: "${GITHUB_TOKEN:?Set GITHUB_TOKEN with repo admin permissions.}"

OWNER="${OWNER:-}"
REPO="${REPO:-}"
BRANCH="${BRANCH:-main}"
RUN_VERIFY="${RUN_VERIFY:-1}"
REQUIRED_CHECKS_CSV="${REQUIRED_CHECKS_CSV:-CI / secret-scan,CI / lint,CI / typecheck,CI / build,CI / api-tests}"

if [[ -z "$OWNER" || -z "$REPO" ]]; then
  REMOTE_URL="$(git remote get-url origin)"
  if [[ "$REMOTE_URL" =~ github.com[:/]([^/]+)/([^/.]+)(\.git)?$ ]]; then
    OWNER="${BASH_REMATCH[1]}"
    REPO="${BASH_REMATCH[2]}"
  else
    echo "Cannot parse owner/repo from origin remote: $REMOTE_URL"
    echo "Set OWNER and REPO explicitly and retry."
    exit 1
  fi
fi

API_BASE="https://api.github.com"
AUTH_HEADERS=(
  -H "Authorization: Bearer ${GITHUB_TOKEN}"
  -H "Accept: application/vnd.github+json"
  -H "X-GitHub-Api-Version: 2022-11-28"
)

echo "==> Preflight secret checks (tracked + history)"
bash scripts/secret-scan.sh --history --warn-local-env

if [[ "$RUN_VERIFY" == "1" ]]; then
  echo "==> Running quality gates (verify)"
  npm run verify
fi

echo "==> Switching repository to public: ${OWNER}/${REPO}"
PUBLIC_STATUS=$(curl -sS -o /tmp/go-public-repo.json -w "%{http_code}" \
  -X PATCH "${AUTH_HEADERS[@]}" \
  "${API_BASE}/repos/${OWNER}/${REPO}" \
  -d '{"private":false}')
if [[ "$PUBLIC_STATUS" != "200" ]]; then
  echo "Failed to update repository visibility (HTTP ${PUBLIC_STATUS})."
  cat /tmp/go-public-repo.json
  exit 1
fi

CONTEXTS_JSON=$(
  printf '%s' "$REQUIRED_CHECKS_CSV" \
    | tr ',' '\n' \
    | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' \
    | sed '/^$/d' \
    | jq -R . \
    | jq -s .
)

PROTECTION_PAYLOAD=$(
  jq -n \
    --argjson contexts "$CONTEXTS_JSON" \
    '{
      required_status_checks: {
        strict: true,
        contexts: $contexts
      },
      enforce_admins: true,
      required_pull_request_reviews: {
        dismiss_stale_reviews: true,
        require_code_owner_reviews: false,
        required_approving_review_count: 1
      },
      restrictions: null,
      required_linear_history: true,
      allow_force_pushes: false,
      allow_deletions: false,
      block_creations: false,
      required_conversation_resolution: true,
      lock_branch: false
    }'
)

echo "==> Applying branch protection on ${BRANCH}"
PROTECTION_STATUS=$(curl -sS -o /tmp/go-public-protection.json -w "%{http_code}" \
  -X PUT "${AUTH_HEADERS[@]}" \
  "${API_BASE}/repos/${OWNER}/${REPO}/branches/${BRANCH}/protection" \
  -d "$PROTECTION_PAYLOAD")
if [[ "$PROTECTION_STATUS" != "200" ]]; then
  echo "Failed to apply branch protection (HTTP ${PROTECTION_STATUS})."
  cat /tmp/go-public-protection.json
  exit 1
fi

echo "==> Done"
echo "Repository is public and branch protection is configured."
echo "Required checks: ${REQUIRED_CHECKS_CSV}"
