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
    // 'jest/no-identical-title': 'error',
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
    'import/prefer-default-export': null,

    // PERSO
    'no-extra-parens': 'error',
    'arrow-parens': ['error', 'as-needed'],

    /* WARNING TO REMOVE */
    'jest/valid-expect': 'warn', // uncomment above
    'jest/no-identical-title': 'warn', // uncomment above
    'vue/require-prop-types': 'warn',
    'import/first': 'warn',

    'no-undef': 'warn',
    'import/extensions': 'warn',
    'import/no-unresolved': 'warn',
    'no-unused-vars': 'warn'
  }
};
