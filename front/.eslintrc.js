module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  env: {
    browser: true,
    'jest/globals': true,
  },
  globals: {
    createLocalVue: false,
    shallowMount: false,
    mount: false,
    RouterLinkStub: false,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:vue/recommended',
    '../.eslintrc.js',
  ],
  plugins: [
    'vue',
    'jest',
  ],
  rules: {
    // 'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-restricted-matchers': 'error',
    'jest/prefer-to-have-length': 'error',
    'jest/prefer-to-be': 'error',
    'jest/valid-expect': 'error',

    /* VueX rules */
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state',
        'acc',
        'e',
      ],
    }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    /* shared custom rules */
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/html-closing-bracket-spacing': ['error', {
      selfClosingTag: 'never',
    }],
    'vue/html-closing-bracket-newline': ['error', {
      multiline: 'never',
    }],
    'vue/script-indent': ['warn', 2, {
      baseIndent: 1,
      switchCase: 1,
    }],

    // PERSO
    'vue/require-prop-types': 'error',
    'no-unused-vars': 'error',
    'no-shadow': 'error',
    'no-undef': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',

    indent: 'off',
    'array-callback-return': 'off',
  },
}
