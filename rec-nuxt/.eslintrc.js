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
    // 'import/no-extraneous-dependencies': ['error', {
    //   'optionalDependencies': ['test/unit/index.js']
    // }],

    // 'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-truthy-falsy': 'error',
    'jest/prefer-to-have-length': 'error',
    'jest/prefer-to-be-undefined': 'error',
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

    /* shared custom rules */
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    'vue/html-closing-bracket-spacing': ['error', {
      'selfClosingTag': 'never',
    }],
    'vue/html-closing-bracket-newline': ['error', {
      'multiline': 'never',
    }],
    "vue/script-indent": ["warn", 2, {
      "baseIndent": 1,
      "switchCase": 1,
    }],

    // PERSO
    'vue/require-prop-types': 'error',
    'no-unused-vars': 'warn',
    'no-shadow': 'warn',
    'no-undef': 'warn',
    'import/no-extraneous-dependencies': 'warn',
    'import/no-unresolved': 'warn'
  }
};
