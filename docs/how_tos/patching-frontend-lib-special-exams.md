# Patching @edx/frontend-lib-special-exams

The package frontend-app-learning depends on @edx/frontend-lib-special-exams, which has an issue in its package.json which prevents imports of components from frontend-app-learning that have dependencies with the other to work.

The issue is caused by an "exports" entry in @edx/frontend-lib-special-exams/package.json which breaks the npm package resolution.

As a fix, we are including a patch in this repo that will be automatically applied when we do a npm install.

Here are the steps to generate this patch:

1. Modify the `package.json` file inside `node_modules/@edx/frontend-lib-special-exams`, removing the "exports" key/value.
2. In the root of this repo, run: `npx patch-package --exclude 'nothing' @edx/frontend-lib-special-exams`
3. The patch will be added to the "patches" folder. Commit the changes.
