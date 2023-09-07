4. frontend-app-learning as a dependency
----------------------------------------

Status
------

Accepted

Context
-------

In the past, we have had difficulties keeping up with latest upstream OpenEDX changes when using a forked and customized version
of a part of it.

To give an example, we have worked with a forked version of the xblock-lti-consumer repository with added customizations on top of it.
Every time we update to a newer OpenEDX release, we need to pull from upstream the latest changes that correspond to the given version
of OpenEDX, because otherwise the code and dependencies may be incompatible.

This process involves fixing not only merge conflicts, but also identifying anything that can break our customizations, and updating 
the customized code to work with the newer codebase and dependencies.

This has proven a challenge in the past, specially after important refactors have been applied to the upstream version, because it 
requires a deep understanding of both the codebase and our customizations to successfully do the update.

Decision
--------

In order to avoid said issues and complications, we decided to limit the surface area between the original learning MFE and our 
customizations by doing the customizations on top of a new custom MFE (this repository) and keeping the original frontend-app-learning 
codebase as a dependency. That way, we can reuse specific components from the original MFE with a clear interface and boundary.

Consequences
------------

By using the original frontend-app-learning as a dependency, when a new OpenEDX is released, we can simply update the 
frontend-app-learning dependency and fix any breaking changes that arise, which will be clearly delimited by the library interface.

References
----------

* https://github.com/wgu-opensource/frontend-app-learning
* https://github.com/wgu-opensource/frontend-app-learning/blob/olive/CHANGES.md
* https://github.com/wgu-opensource/frontend-app-learning/blob/olive/src/exports.js
