#!/usr/bin/env bash
set -euo pipefail

git config core.hooksPath .githooks
echo "Configured git hooks path: .githooks"
echo "Enabled hook: pre-push (secret scan + lint + typecheck)"
