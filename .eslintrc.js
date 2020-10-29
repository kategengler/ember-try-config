'use strict';

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:prettier/recommended'],
  env: {
    node: true,
  },
  rules: {},
  overrides: [
    {
      files: ['test/**/*.js'],

      env: {
        jest: true,
      },
    },
  ],
};
