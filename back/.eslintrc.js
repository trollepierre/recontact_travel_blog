module.exports = {
  root: true,
  extends: '../.eslintrc.js',
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
  }
}
