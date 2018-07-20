// http://eslint.org/docs/user-guide/configuring

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
    'airbnb-base',
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    'jest'
  ],
  // add your custom rules here
  rules: {
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],

    /* Jest rules */
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    // 'jest/valid-expect': 'error',

    /* VueX rules */
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    /* YPAM custom rules */
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    'import/prefer-default-export': null,
    'key-spacing': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': 'error',
    'padded-blocks': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'space-before-function-paren': 'error',

    /* WARNING TO REMOVE */
    'jest/valid-expect': 'warn', // uncomment celui du hatu
    'vue/require-prop-types': 'warn',
    'jest/no-identical-title': 'warn',
    'import/first': 'warn',

    'no-undef': 'warn',
    'import/extensions': 'warn',
    'import/no-unresolved': 'warn',
    'no-unused-vars': 'warn'
  }
};
