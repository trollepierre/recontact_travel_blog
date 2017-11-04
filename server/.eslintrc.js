module.exports = {
    'extends': '../.eslintrc.js',
    'plugins': [
        'promise'
    ],
    'env': {
        'node': true,
        'es6': true
    },
    'settings': {
        'import/resolver': {
            'node' : true
        }
    },
  'rules': {
    'no-use-before-define': 0
  }
};
