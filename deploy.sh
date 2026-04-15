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
echo "Syncing app.js from beach-app-core to courtsense..."

# Pull latest so our commit lands cleanly
git pull --rebase

# Copy the source-of-truth app.js into the courtsense repo
cp "$REPO_DIR/app.js" "$COURTSENSE_DIR/app.js"

# Also bump any legacy CDN version tags in shell HTML (no-op if none exist)
while IFS= read -r -d '' file; do
  if grep -q "beach-app-core@v" "$file"; then
    sed -i "s|beach-app-core@v[0-9]*\.[0-9]*\.[0-9]*|beach-app-core@${NEW_TAG}|g" "$file"
    echo "  Updated version tag in: $file"
  fi
done < <(find . -name "index.html" -print0)

if git diff --quiet && git diff --cached --quiet; then
  echo "courtsense already in sync, nothing to commit"
else
  git add -A
  git commit -m "sync app.js to $NEW_TAG"
  git push
  echo "Courtsense repo updated and pushed"
fi

echo ""
echo "Deploy complete: $NEW_TAG"
echo "Purge CDN: https://purge.jsdelivr.net/gh/markmcnees/beach-app-core@main/app.js"
