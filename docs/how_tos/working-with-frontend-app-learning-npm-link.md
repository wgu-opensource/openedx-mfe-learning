# Working with frontend-app-learning and testing with npm link

Sometimes you may need to do changes in frontend-app-learning to export components that you need to use in this project, specially during the initial stages of it.

In order to do this in a more agile way, you can clone both frontend-app-learning and openedx-mfe-learning in your local machine and link them with `npm link`. That way, you will immediately see any changes you do on frontend-app-learning applied to this project (after doing a build).

Here are the steps to achieve this:

1. Clone (frontend-app-learning)[https://github.com/wgu-opensource/frontend-app-learning] in your local machine (location doesn't matter).
2. Clone (openedx-mfe-learning)[https://github.com/wgu-opensource/openedx-mfe-learning] in your local machine (location doesn't matter).
3. cd into `frontend-app-learning` and do `npm install`, `make build` and `npm link`
4. cd into `openedx-mfe-learning` and do `npm install` and `npm link @edx/frontend-app-learning`
5. Now you can do `npm start` and start working with `openedx-mfe-learning`.

Whenever you do changes on `frontend-app-learning`, do: `make build` inside `frontend-app-learning`. Changes will be immediately available to `openedx-mfe-learning`.

## Technical details and gotchas

In order to achieve this, we needed to do some workarounds to avoid having two versions of libraries loaded at the same time, specifically react.

This could happen because frontend-app-learning has the dependency already installed in its node_modules, and this project also has it. During build, webpack will find the closest one to the given code and bundle it. This causes runtime issues that are hard to debug.

This doesn't happen when installing frontend-app-learning in the normal way, because those dependencies are not installed (they are defined in devDependencies and peerDependencies in its package.json).

In order to work around this, we added specific overrides to known libraries that could cause issues to the `webpack.dev.conf.js` configuration file.
