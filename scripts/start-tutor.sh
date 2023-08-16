#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=".."
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Make sure we start at the script dir
cd "$SCRIPT_DIR"

cd "$PROJECT_ROOT"
pipenv run tutor local launch

# Patch Caddyfile
CADDYFILE_PATH="$(pipenv run tutor config printroot)/env/apps/caddy/Caddyfile"
rm -f "$CADDYFILE_PATH"
cp "$SCRIPT_DIR/resources/Caddyfile" "$CADDYFILE_PATH"
# Restart caddy
pipenv run tutor local restart caddy