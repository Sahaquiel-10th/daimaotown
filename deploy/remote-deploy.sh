#!/usr/bin/env bash
set -euo pipefail

app_root="/opt/daimaotown"
release_root="$app_root/releases"
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

mkdir -p "$release_root"
release_dir="$release_root/$commit_sha"
if [[ ! -d "$release_dir" ]]; then
  staging_dir="$(mktemp -d "$release_root/.staging-$commit_sha.XXXXXX")"
  tar -xzf - -C "$staging_dir"
  test -f "$staging_dir/dist/index.html"
  test -f "$staging_dir/server/index.js"
  mv "$staging_dir" "$release_dir"
fi

ln -sfn "$release_dir" "$app_root/current.next"
mv -Tf "$app_root/current.next" "$app_root/current"
sudo /bin/systemctl restart daimaotown.service
curl --fail --silent --show-error http://127.0.0.1:3080/api/town/health >/dev/null
echo "daimaotown deployed: $commit_sha"
