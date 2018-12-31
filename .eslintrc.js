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
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    'curly': ['error', 'all'],
    'func-style': ['error', 'expression'],
    'import/prefer-default-export': 0,
    'import/no-duplicates': 'error',
    // 'indent': ['error', 2, { 'SwitchCase': 1 }],
    'key-spacing': 'error',
    'keyword-spacing': [2, {'before': true, 'after': true}],
    'no-extra-parens': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': ['error', {'max': 1}],
    'no-shadow': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': 'error',
    'object-shorthand': 'error',
    'padded-blocks': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    'require-await': 'error',
    'semi': ['error', 'never'],
    'space-before-function-paren': 'error',
    'space-infix-ops': ['error', {'int32Hint': false}],

    // PTR rules
    'import/default': 0,
    // 'sort-imports': 'warn',
    'max-lines': 'warn',
    'max-len': 0,
    'no-console': 0,
    'no-tabs': 2,
    'no-underscore-dangle': 0
  },
};
