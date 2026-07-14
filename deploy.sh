#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh "commit message describing the change"

if [ $# -lt 1 ]; then
  echo "Usage: ./deploy.sh \"commit message\""
  exit 1
fi

MSG="$1"
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
COURTSENSE_DIR="$REPO_DIR/../courtsense"

# ── 1. Syntax check ─────────────────────────────────────────
echo "Running syntax check..."
node --check "$REPO_DIR/app.js"

# ── 2. Get latest tag and bump patch version ─────────────────
LATEST_TAG=$(git -C "$REPO_DIR" tag --sort=-v:refname | head -1)
if [ -z "$LATEST_TAG" ]; then
  echo "Error: no existing git tags found"
  exit 1
fi

# Strip leading v, split on dots, increment patch
VERSION="${LATEST_TAG#v}"
MAJOR=$(echo "$VERSION" | cut -d. -f1)
MINOR=$(echo "$VERSION" | cut -d. -f2)
PATCH=$(echo "$VERSION" | cut -d. -f3)
NEW_PATCH=$((PATCH + 1))
NEW_TAG="v${MAJOR}.${MINOR}.${NEW_PATCH}"

echo "Latest tag: $LATEST_TAG -> New tag: $NEW_TAG"

# ── 3. Commit and push app.js ───────────────────────────────
cd "$REPO_DIR"
if git diff --quiet app.js && git diff --cached --quiet app.js; then
  echo "No changes to app.js, skipping commit"
else
  git add app.js
  git commit -m "$MSG"
  echo "Committed: $MSG"
fi
git push
echo "Pushed to main"

# ── 4. Tag and push ─────────────────────────────────────────
git tag "$NEW_TAG"
git push origin "$NEW_TAG"
echo "Tagged and pushed $NEW_TAG"

# ── 5. Update courtsense shell repos ────────────────────────
if [ ! -d "$COURTSENSE_DIR" ]; then
  echo "Warning: courtsense repo not found at $COURTSENSE_DIR, skipping shell update"
  echo ""
  echo "Deploy complete: $NEW_TAG (shell update skipped)"
  exit 0
fi

cd "$COURTSENSE_DIR"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Error: courtsense repo is on branch '$CURRENT_BRANCH', expected 'main'."
  echo "Switch courtsense to main and re-run, or this deploy will land on the wrong branch."
  exit 1
fi

echo "Syncing app.js from beach-app-core to courtsense..."

# Pull latest so our commit lands cleanly
git pull --rebase origin main

# Copy the source-of-truth app.js into the courtsense repo
cp "$REPO_DIR/app.js" "$COURTSENSE_DIR/app.js"

# Also bump any legacy CDN version tags in shell HTML (no-op if none exist)
while IFS= read -r -d '' file; do
  if grep -q "beach-app-core@v" "$file"; then
    sed -i "s|beach-app-core@v[0-9]*\.[0-9]*\.[0-9]*|beach-app-core@${NEW_TAG}|g" "$file"
    echo "  Updated version tag in: $file"
  fi
done < <(find . -name "index.html" -print0)

# Cache-bust: bump the ?v= query on the served shells so browsers/CDN fetch the new
# app.js immediately instead of aging out on the ~10-min GitHub Pages edge TTL.
# Only rewrites shells that ALREADY carry a ?v= (the 4 served shells). Bare
# src="/app.js" references (e.g. the onboard generator template) are left untouched.
while IFS= read -r -d '' file; do
  if grep -q 'src="/app\.js?v=' "$file"; then
    sed -i -E "s|src=\"/app\.js\?v=[0-9]+\.[0-9]+\.[0-9]+\"|src=\"/app.js?v=${NEW_TAG#v}\"|g" "$file"
    echo "  Cache-bust app.js -> ?v=${NEW_TAG#v} in: $file"
  fi
done < <(find . \( -name "index.html" -o -name "404.html" \) -print0)

# Stage only app.js plus any HTML files the sed-replace block touched.
# Never use git add -A here; courtsense often has untracked notes files
# in its working tree that should not be swept into a deploy commit.
git add app.js
# Re-stage any tracked HTML files modified by the legacy CDN-tag bump above.
# Use git's own pathspec filter (not grep) so a "no HTML changed" case yields
# empty output at exit 0 instead of aborting the script under pipefail.
git diff --name-only -- '*.html' | xargs -r git add

if git diff --cached --quiet; then
  echo "courtsense already in sync, nothing to commit"
else
  git commit -m "sync app.js to $NEW_TAG"
  git push origin main
  echo "Courtsense repo updated and pushed"
fi

echo ""
echo "Deploy complete: $NEW_TAG"
echo "Live at: https://courtsense.app/app.js (hard reload school apps to verify)"
