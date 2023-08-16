const { createConfig } = require("@edx/frontend-build");

module.exports = createConfig("webpack-dev-server", {
  devServer: {
    allowedHosts: ["apps.local.overhang.io"],
  },
});
