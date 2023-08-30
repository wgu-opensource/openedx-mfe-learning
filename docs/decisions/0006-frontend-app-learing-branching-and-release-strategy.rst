6. frontend-app-learning fork branching and release strategy
------------------------------------------------------------

Status
------

Accepted

Context
-------

The fork of frontend-app-learning was created originally based on the latest version of the MFE compatible with olive.

For this, we created a "olive" branch and set it as the default branch in GitHub. This naming convention should be 
followed in the future. For example, when we update to "palm", we will create a "palm" branch and pull changes from the
latest upstream tag that corresponds to that OpenEDX version.

For releases, because npm is getting the library directly from GitHub, we need to have a branch which will include the 
built library files, which are normally ignored by .gitignore.

In order to do that, we created a "olive-dist" branch, which will have the latest build for the "olive" version created
following the instructions here:
https://github.com/wgu-opensource/openedx-mfe-learning/blob/main/docs/how_tos/releasing-changes-to-frontend-app-learning-lib.md

For every release, we will create a tag corresponding to the given version, pointing to the latest commit in "olive-dist" 
at the time of release.

Decisions
---------

1. Have branches named by the release of OpenEDX we are targeting (olive, palm, etc.)
2. The code in those branches should be up to date to the latest upstream tag that corresponds to the given OpenEDX version
3. The branch corresponding to the current OpenEDX release we are targeting should be set as the default branch in GitHub
4. We will also have branches named after the OpenEDX release but ending in "-dist" (olive-dist, palm-dist, etc.), which will host the latest build based on whatever is in the corresponding main version branch
5. We will create a release and tag in GitHub for each release, pointing to the latest commit in the "\*-dist" branch at the time
6. We will follow this process for releases: https://github.com/wgu-opensource/openedx-mfe-learning/blob/main/docs/how_tos/releasing-changes-to-frontend-app-learning-lib.md

Consequences
------------

These strategies should make it easy to keep the code updated with upstream, and do releases as required.

References
----------

* https://github.com/wgu-opensource/frontend-app-learning
* https://github.com/wgu-opensource/openedx-mfe-learning/blob/main/docs/how_tos/releasing-changes-to-frontend-app-learning-lib.md
