# Adding a feature flag

Here are the steps you need to follow to add and use a feature flag.

Please refer to `decisions/0008-use-mfe-config-api-feature-flags` for more information on how this works.

## Implementation steps

1. Decide a name for the feature flag, it should be all upper snake case. (example: ENABLE_SOMETHING)
2. Add the feature flag to `.env.development` and `.env` with the default value you want it to have. If it is a boolean, make sure to use `true` or `false` in lowercase
3. Load your flag from the env in the `mergeConfig` call in the app main `index.jsx`. If it is a boolean, make sure to cast it from string, because everything is a string in the env.
4. In the file for the component where you are going to use the flag, add a call to the `ensureConfig` function from `@edx/frontend-platform/config`
5. Inside the component render function, get the flag with the `getConfig` function from `@edx/frontend-platform/config`
6. Use the value to decide to show or hide things, or enable or disable things

Example component using a feature flag:

```jsx
import { ensureConfig, getConfig } from "@edx/frontend-platform/config";

ensureConfig(["ENABLE_SOMETHING"], "Example component");

const Example = () => {
  const enableSomething = getConfig().ENABLE_SOMETHING === true;
  return <div>{enableSomething && <p>Something</p>}</div>;
};

export default Example;
```

## Usage

For setting the variable dinamically for a specific OpenEDX site, follow these steps:

1. Go to `http://local.overhang.io/admin/site_configuration/siteconfiguration/` (adjust the base url to the desired environment) and select the specific site you want to configure
2. Inside the "Site values" JSON, add a "MFE_CONFIG" key with an empty object as a value, if it doesn't exist already.
3. Inside that "MFE_CONFIG" object, add your variables in valid JSON syntax.

Example Site values:

```json
{
  "MFE_CONFIG": {
    "ENABLE_SOMETHING": true
  }
}
```

The values you set in the site config will override anything that was set on the .env files.

**Please note:** The MFE config API, which is used by the MFE to get the values set in the site config, has a cache, so you may see a delay between the time you set a value and it gets updated from the API.
