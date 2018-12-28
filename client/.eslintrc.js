module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    'jest/globals': true
  },
  globals: {
    'createLocalVue': false,
    'shallowMount': false,
    'mount': false,
    'RouterLinkStub': false,
  },
  extends: [
    '../.eslintrc.js',
    'plugin:vue/recommended',
  ],
  plugins: [
    'vue',
    'jest'
  ],
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],

    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',

    /* VueX rules */
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state',
        'acc',
        'e'
      ]
    }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    /* YPAM custom rules */
    'import/prefer-default-export': null,

    // PERSO
    'arrow-parens': ['error', 'as-needed'],
    'import/extensions': 'error',
    'import/first': 'error',
    'import/no-unresolved': 'error',
    'no-extra-parens': 'error',
    'no-undef': 'error',
    'no-unused-vars': 'error',
    'vue/require-prop-types': 'error'
  }
};
