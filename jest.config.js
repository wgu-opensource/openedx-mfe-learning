const { createConfig } = require('@edx/frontend-build');
const path = require('path');

module.exports = createConfig('jest', {
  // setupFilesAfterEnv is used after the jest environment has been loaded.  In general this is what you want.
  // If you want to add config BEFORE jest loads, use setupFiles instead.
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.js',
    'src/i18n',
  ],
  // Mapping required for solving dependency conflicts
  moduleNameMapper: {
    rosie: path.resolve('./node_modules/rosie'),
    '^@edx/frontend-platform(.*)$': `${path.resolve('./node_modules/@edx/frontend-platform')}$1`,
    '^@edx/paragon(.*)$': `${path.resolve('./node_modules/@edx/paragon')}$1`,
    '^prop-types$': path.resolve('./node_modules/prop-types'),
    '^react$': path.resolve('./node_modules/react'),
    '^react-dom$': path.resolve('./node_modules/react-dom'),
    '^react-redux$': path.resolve('./node_modules/react-redux'),
    '^react-router-dom$': path.resolve('./node_modules/react-router-dom'),
    '^redux$': path.resolve('./node_modules/redux'),
  },
});
