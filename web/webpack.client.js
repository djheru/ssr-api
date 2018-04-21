require('dotenv').config();
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpack = require('webpack');

const { API_HOST } = process.env;

const config = {
  // Server entry point
  entry: ['babel-polyfill', './src/client/index.js'],
  devtool: 'source-map',

  // output options
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new webpack.DefinePlugin({
      API_HOST: JSON.stringify(API_HOST)
    })
  ]
};

module.exports = merge(baseConfig, config);
