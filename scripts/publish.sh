#!/usr/bin/env bash
set -euo pipefail

# publish.sh — Sync skills from workgroup-ai monorepo and push to marketplace
#
# Usage:
#   ./scripts/publish.sh              # sync + commit + push
#   ./scripts/publish.sh --dry-run    # sync + show diff, don't commit
#
# What it does:
#   1. Syncs skills from ~/coding/workgroup-ai/skills/ to ./skills/
#      (excludes internal/marketing skills that shouldn't be public)
#   2. Reads version from plugin.json
#   3. Commits and pushes to curiositech/windags-skills
#   4. Updates the local Claude plugin cache
#
# Prerequisites:
#   - gh CLI authenticated
#   - workgroup-ai repo at ~/coding/workgroup-ai

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MONOREPO="${MONOREPO_PATH:-$HOME/coding/workgroup-ai}"
CACHE_DIR="$HOME/.claude/plugins/cache/windags-skills/windags-skills"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
fi

# --- Validate ---
if [[ ! -d "$MONOREPO/skills" ]]; then
  echo "Error: workgroup-ai monorepo not found at $MONOREPO"
  echo "Set MONOREPO_PATH to override."
  exit 1
fi

cd "$REPO_DIR"

# --- Read version ---
VERSION=$(python3 -c "import json; print(json.load(open('plugin.json'))['version'])")
echo "Publishing windags-skills v${VERSION}"

# --- Internal skills to exclude from public plugin ---
EXCLUDE_SKILLS=(
  "next-move-customer-persona"
  "next-move-marketing"
  "someclaudeskills-strategy"
  "windags-architect-v1"
  "windags-customer-persona"
)

RSYNC_EXCLUDES=""
for skill in "${EXCLUDE_SKILLS[@]}"; do
  RSYNC_EXCLUDES="$RSYNC_EXCLUDES --exclude=$skill"
done

# --- Sync skills ---
echo "Syncing skills from monorepo..."
eval rsync -av --delete $RSYNC_EXCLUDES \
  "$MONOREPO/skills/" "$REPO_DIR/skills/"

SKILL_COUNT=$(ls -1 skills/ | wc -l | tr -d ' ')
echo "Synced $SKILL_COUNT skills"

if $DRY_RUN; then
  echo ""
  echo "=== DRY RUN — changes below would be committed ==="
  git diff --stat
  git status --short
  echo ""
  echo "Run without --dry-run to commit and push."
  exit 0
fi

# --- Commit and push ---
git add -A
CHANGES=$(git diff --cached --stat | tail -1)

if [[ -z "$(git diff --cached --name-only)" ]]; then
  echo "No changes to publish."
  exit 0
fi

git commit -m "release: windags-skills v${VERSION}

${CHANGES}
Synced ${SKILL_COUNT} skills from workgroup-ai monorepo."

git push origin main

echo ""
echo "Pushed v${VERSION} to curiositech/windags-skills"

# --- Update local cache ---
CACHE_VERSION_DIR="$CACHE_DIR/2.0.0"  # Cache dir uses original version path
if [[ -d "$CACHE_VERSION_DIR" ]]; then
  echo "Updating local plugin cache..."
  rsync -av --delete \
    --exclude=".git" \
    "$REPO_DIR/" "$CACHE_VERSION_DIR/"
  echo "Local cache updated. Changes take effect immediately."
else
  echo "Note: Local cache not found at $CACHE_VERSION_DIR"
  echo "Run: claude plugin marketplace add curiositech/windags-skills"
fi

echo ""
echo "Done. v${VERSION} is live."
