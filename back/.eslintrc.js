module.exports = {
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    '../.eslintrc.js',
  ],
  root: true,
  env: {
    node: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      node: true,
    },
  },
  rules: {
    'func-style': ['off', 'expression'],
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
    'import/no-import-module-exports': 'off', // code is babelified
  },
}
