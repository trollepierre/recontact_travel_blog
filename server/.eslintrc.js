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
    'import/named': 1,
    'no-use-before-define': 0,
  },
};
