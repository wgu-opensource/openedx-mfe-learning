const { createConfig } = require('@edx/frontend-build');
const path = require('path');

module.exports = createConfig('webpack-dev-server', {
  devServer: {
    allowedHosts: ['all'],
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
  },
  resolve: {
    /*
      Make sure webpack picks only one version for each dependency that also exists in frontend-app-learning.
      Useful when developing with npm link.
    */
    alias: {
      '@edx/frontend-platform': path.resolve('./node_modules/@edx/frontend-platform'),
      '@edx/paragon': path.resolve('./node_modules/@edx/paragon'),
      'prop-types': path.resolve('./node_modules/prop-types'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'react-redux': path.resolve('./node_modules/react-redux'),
      'react-router-dom': path.resolve('./node_modules/react-router-dom'),
      redux: path.resolve('./node_modules/redux'),
    },
  },
});
