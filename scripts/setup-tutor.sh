#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=".."
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Make sure we start at the script dir
cd "$SCRIPT_DIR"

cd "$PROJECT_ROOT"
pipenv install
pipenv run tutor config save
pipenv run tutor images build openedx permissions
pipenv run tutor config save --set DOCKER_IMAGE_MYSQL=mariadb:10.4
pipenv run tutor local launch # Initial launch required for setting up dbs etc.

echo "Creating OpenEDX Test user: staff@example.com"
echo "Please enter the new user password:"
pipenv run tutor local do createuser --staff --superuser staff staff@example.com
pipenv run tutor local do importdemocourse
