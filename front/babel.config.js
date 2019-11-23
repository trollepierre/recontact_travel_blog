module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
      },
    ],
  ]

  return {
    presets,
    plugins: [['@babel/transform-runtime']],
  }
}
