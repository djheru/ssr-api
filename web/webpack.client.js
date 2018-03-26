const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const config = {
  // Server entry point
  entry: ['babel-polyfill', './src/client/index.js'],
  devtool: 'source-map',

  // output options
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  }
};

module.exports = merge(baseConfig, config);
