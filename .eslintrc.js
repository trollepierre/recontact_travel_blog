module.exports = {
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  rules: {
    /* YPAM custom rules */
    'array-element-newline': ['error', 'consistent'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    'curly': ['error', 'all'],
    'key-spacing': 'error',
    'keyword-spacing': [2, {'before': true, 'after': true}],
    'max-len': 0,
    'no-console': 0,
    'no-extra-parens': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': ['error', {'max': 1}],
    'no-shadow': 'error',
    'no-tabs': 2,
    'no-trailing-spaces': 'error',
    'no-underscore-dangle': 0,
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': 'error',
    'object-shorthand': 'error',
    'padded-blocks': [2, {
      blocks: 'never',
      classes: 'always',
      switches: 'never',
    }],
    'prefer-const': 'error',
    'prefer-template': 'error',
    'import/default': 0,
    'import/prefer-default-export': 0,
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    'require-await': 'error',
    'semi': ['error', 'never'],
    'space-before-function-paren': 'error',
    'space-infix-ops': ['error', {'int32Hint': false}],

    // PTR rules
    'sort-imports': 'warn',
    'max-lines': 'warn',
  },
};
