# Releasing changes to frontend-app-learing as a library

After doing changes to https://github.com/wgu-opensource/frontend-app-learning olive branch, you need to build a dist in order to make it usable via npm.

To do that, follow the following process:

1. Change to branch olive-dist
2. Pull changes from olive
3. Run a build
4. Force-add the dist folder and commit
5. Push changes to olive-dist
6. Create release/tag in GitHub
7. Update the tag in package.json of this repo.

## Step by step commands

```
# On https://github.com/wgu-opensource/frontend-app-learning
git checkout olive-dist
git pull origin olive
make build
git add -f dist
git commit -m "Release <your release>"
git push origin olive-dist
# Go to github and do a release
```
