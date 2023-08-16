#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=".."
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# Make sure we start at the script dir
cd "$SCRIPT_DIR/$PROJECT_ROOT"

read -p "Are you sure? this will delete all OpenEDX data, including databases and files [y/N]" -n 1 -r
echo ""
if ! [[ $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi


if [ -x "$(pipenv run command -v tutor)" ]; then
    rm -rf "$(pipenv run tutor plugins printroot)" || true
    sudo rm -rf "$(pipenv run tutor config printroot)" || true
fi


# Remove docker containers
docker ps -a | grep "tutor_local" | awk '{print $1}' | xargs docker rm -v -f || true
