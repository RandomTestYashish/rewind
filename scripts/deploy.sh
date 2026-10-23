#!/usr/bin/env bash
# Builds the app and publishes dist/ to the gh-pages branch (GitHub Pages source).
set -euo pipefail
cd "$(dirname "$0")/.."
npm test
npm run build
touch dist/.nojekyll
tmp=$(mktemp -d)
cp -R dist/. "$tmp"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -qm "Deploy $(git -C "$OLDPWD" rev-parse --short HEAD)"
git push -qf "$(git -C "$OLDPWD" remote get-url origin)" gh-pages
rm -rf "$tmp"
echo "Deployed: https://randomtestyashish.github.io/rewind/"
