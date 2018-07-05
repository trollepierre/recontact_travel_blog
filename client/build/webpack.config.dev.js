'use strict'
const { blueBright, magentaBright } = require('chalk')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const { HotModuleReplacementPlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const generateEnvFileContent = require('./env/env-vars-helper')
const { resolveFromRootDir } = require('./webpack.utils')

const DEFAULT_PORT = 8000

module.exports = {
  mode: 'development',

  devtool : 'cheap-module-eval-source-map',

  entry: {
    env: './build/env/env-vars-template.js',
    app: ['babel-polyfill', 'whatwg-fetch', './src/main.js'],
  },

  output: {
    path: resolveFromRootDir('dist'),
    filename: '[name].js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolveFromRootDir('src'),
    },
  },

  devServer: {
    clientLogLevel: 'warning',
    compress: true,
    historyApiFallback: true,
    hot: true,
    overlay: {
      warnings: false,
      errors: true
    },
    port: DEFAULT_PORT,
    quiet: true,
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'vue-style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
        ]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'vue-style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
          { loader: 'sass-resources-loader',
            options: {
              sourceMap: true,
              resources: [
                resolveFromRootDir('src/styles/variables.scss'),
              ]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolveFromRootDir('src')],
      },
      {
        test: /env-vars-template\.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: 'window.env = {}', replace: generateEnvFileContent() },
          ]
        }
      }
    ]
  },

  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is accessible at ${blueBright(`http://localhost:${DEFAULT_PORT}`)}`],
        notes: [
          'Note that the development build is not optimized',
          `To create a production build, use ${magentaBright('yarn build')}`,
        ]
      },
    }),
    new HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolveFromRootDir('index.html'),
      inject: true
    })
  ]
}
