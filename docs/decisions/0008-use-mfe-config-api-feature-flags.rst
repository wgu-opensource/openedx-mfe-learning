8. Use MFE Config API for feature flags and custom site configuration
---------------------------------------------------------------------

Status
------

Proposed

Context
-------

We would like to have a way for enabling and disabling features on the MFE depending on the site or product.

We would also like to do customizations via configuration specific to sites or products without requiring a custom build for each.

Decision
--------

Use the MFE Config API that is included with OpenEDX starting with olive version.

The MFE Config API is a great option for this. It is enabled by default starting in olive, and you can add variables to it dynamically in the EDX admin, under "Site configuration" (as a JSON object under the MFE_CONFIG key), which also supports multi tenant installations.

From the MFE code, we can get the values with the geConfig function, which is part of the @edx/frontend-platform package (https://openedx.github.io/frontend-platform/module-Config.html).

On performance: The MFE Config API is cached by default.

For the upgrade, we may need to manually enable the MFE Config API by setting the ENABLE_MFE_CONFIG_API setting in the Django config.

On the MFE, we need to make sure to correctly set the APP_ID and MFE_CONFIG_API_URL env variables. See .env.development for an example.


Consequences
------------

By using the MFE Config API we will be able to dynamically set configuration variables from the Django Admin under site config.

References
----------

* https://github.com/openedx/edx-platform/blob/master/lms/djangoapps/mfe_config_api/docs/decisions/0001-mfe-config-api.rst
* https://docs.openedx.org/en/latest/community/release_notes/olive.html#mfe-runtime-configuration
* https://openedx.github.io/frontend-platform/module-Config.html
