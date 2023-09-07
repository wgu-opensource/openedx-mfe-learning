# Updating to a new OpenEDX version

When updating the MFE to work on anew OpenEDX version, you need to follow the following steps:

1. Update [frontend-app-learning](https://github.com/wgu-opensource/frontend-app-learning) fork to the latest upstream tag for the desired version following the strategies described in ´docs/decisions/0006-frontend-app-learing-branching-and-release-strategy´
2. Make sure to re-apply the desired corrections in package.json if needed
3. Do any adjustments to ´src/exports.js´ in frontend-app-learning if needed
4. Release a new version of frontend-app-learning following the steps defined in ´docs/how_tos/releasing-changes-to-frontend-app-learning-lib´
5. Update the version of frontend-app-learning in this repo's package.json. Make sure the correct version is applied to package-lock.json after installing
6. Update libraries to match the versions used by frontend-app-learning (react, @edx/frontend-platform, etc.)
7. Test and do any adjustments caused by breaking changes (if any)
