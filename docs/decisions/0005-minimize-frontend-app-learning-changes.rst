5. Minimize frontend-app-learning changes
-----------------------------------------

Status
------

Accepted

Context
-------

In order to be able to use the original frontend-app-learning as a library, some modifications were required
over the original codebase, wich was forked here: https://github.com/wgu-opensource/frontend-app-learning

We would like to keep these modifications to a minimum in order to make it easy to pull changes from upstream.

Decisions
---------

1. Any change to the original codebase should be documented on a file named CHANGES.md in the root of the repository
2. We created a src/exports.js file that will be used as the library entrypoint, in which the export any component or code that we want to reuse
3. After the initial modifications, any further modification should only be done to the src/exports.js file
4. The initial modifications involved (see https://github.com/wgu-opensource/frontend-app-learning/blob/olive/CHANGES.md):
    
   a. Adding a command to the Makefile (for building the code as a library)
   b. Adding the CHANGES.md file
   c. Adding the src/exports.js file
   d. Adding a patch to a library (see https://github.com/wgu-opensource/openedx-mfe-learning/blob/main/docs/how_tos/patching-frontend-lib-special-exams.md)
   e. Customizations to package.json

Consequences
------------

When pulling changes from upstream, the only file that will probably require manual intervention will be package.json.

When this happens, please review CHANGES.md for understanding the original changes an what needs to be reapplied.

References
----------

* https://github.com/wgu-opensource/frontend-app-learning
* https://github.com/wgu-opensource/frontend-app-learning/blob/olive/CHANGES.md
* https://github.com/wgu-opensource/openedx-mfe-learning/blob/main/docs/how_tos/patching-frontend-lib-special-exams.md
