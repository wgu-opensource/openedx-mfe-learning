# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Created base app from template: https://github.com/openedx/frontend-template-application
- Added `README.md` with dev setup instructions
- Added scripts to automate setting up a minimal dev environment (See `README.md` and `Makefile`)
- Customized package.json
- Added `patch-package` and patch for a problematic dependency, see `docs/how_tos/patching-frontend-lib-special-exams.md`
- Added frontend-app-learning as an npm dependency
- Implemented initial app base, setting up providers and Redux and importing components from frontend-app-learning
