#!/usr/bin/env bash
set -euo pipefail

app_root="/opt/daimaotown"
repo_dir="$app_root/repository"
release_root="$app_root/releases"
repository_url="https://github.com/Sahaquiel-10th/daimaotown.git"
request="${1:-${SSH_ORIGINAL_COMMAND:-}}"

if [[ "$request" =~ ^deploy[[:space:]]+([0-9a-f]{40})$ ]]; then
  commit_sha="${BASH_REMATCH[1]}"
elif [[ "$request" =~ ^[0-9a-f]{40}$ ]]; then
  commit_sha="$request"
else
  echo "usage: deploy <40-character commit sha>" >&2
  exit 64
fi

exec 9>"$app_root/deploy.lock"
flock -n 9 || { echo "another daimaotown deployment is already running" >&2; exit 75; }

mkdir -p "$repo_dir" "$release_root"
if [[ ! -d "$repo_dir/.git" ]]; then
  git clone --filter=blob:none "$repository_url" "$repo_dir"
fi

git -C "$repo_dir" remote set-url origin "$repository_url"
git -C "$repo_dir" fetch --prune origin main
remote_sha="$(git -C "$repo_dir" rev-parse origin/main)"
if [[ "$remote_sha" != "$commit_sha" ]]; then
  echo "requested commit is not the current origin/main" >&2
  exit 65
fi

release_dir="$release_root/$commit_sha"
if [[ ! -d "$release_dir" ]]; then
  staging_dir="$release_root/.staging-$commit_sha"
  mkdir -p "$staging_dir"
  git -C "$repo_dir" archive "$commit_sha" | tar -x -C "$staging_dir"
  cd "$staging_dir"
  npm ci
  npm test
  npm run build
  npm prune --omit=dev
  mv "$staging_dir" "$release_dir"
fi

ln -sfn "$release_dir" "$app_root/current.next"
mv -Tf "$app_root/current.next" "$app_root/current"
sudo /bin/systemctl restart daimaotown.service
curl --fail --silent --show-error http://127.0.0.1:3080/api/town/health >/dev/null
echo "daimaotown deployed: $commit_sha"
