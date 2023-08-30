7. Follow Paragon design system
-------------------------------

Status
------

Proposed

Context
-------

OpenEDX and its micro frontends use the Paragon design system, which is a pattern library 
containing accesible React components and a SCSS foundation built on Bootstrap.

Using this library makes it possible to apply themes (mostly colors) as defined by the @openedx/brand package.

Decision
--------

We will use Paragon components as much as possible to implement our custom UI.

Consequences
------------

This will allow us to easily theme the application by changing the @openedx/brand package.

References
----------

* https://github.com/openedx/paragon
* https://paragon-openedx.netlify.app
