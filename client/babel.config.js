module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: '3.0.0',
        targets: {
          browsers: [
            '> 1%',
            'last 2 versions',
            'not ie <= 8',
          ],
        },
      },
    ],
  ],
  plugins: [
    'transform-vue-jsx',
    '@babel/plugin-transform-runtime',
  ],
  env: {
    test: {
      presets: [
        '@babel/preset-env',
      ],
    },
  },
}
