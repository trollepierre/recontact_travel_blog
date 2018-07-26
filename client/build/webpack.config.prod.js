'use strict'
const BrotliGzipPlugin = require('brotli-gzip-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const { VueLoaderPlugin } = require('vue-loader')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

const generateEnvFileContent = require('./env/env-vars-helper')
const { resolveFromRootDir } = require('./webpack.utils')

module.exports = {
  mode: 'production',

  entry: {
    env: './build/env/env-vars-prod.js',
    app: ['babel-polyfill', 'whatwg-fetch', './src/main.js'],
  },

  output: {
    path: resolveFromRootDir('dist'),
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[name].[chunkhash].js',
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolveFromRootDir('src'),
    },
  },

  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new UglifyJsPlugin({ parallel: true }),
      new OptimizeCSSAssetsPlugin({}),
    ]
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          productionMode: true,
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
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
        exclude: /node_modules/,
        include: [resolveFromRootDir('src')],
      },
      {
        test: /env-vars-prod\.js$/,
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
    new BrotliGzipPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new HtmlWebpackPlugin({
      template: resolveFromRootDir('index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: 'dependency',
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[chunkhash].css",
      chunkFilename: "static/css/[name].[chunkhash].css"
    }),
    new VueLoaderPlugin(),
  ]
}
