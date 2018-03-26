const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpackNodeExternals = require('webpack-node-externals');

const config = {
  // Use node.js environment, not browser
  target: 'node',

  // Server entry point
  entry: ['babel-polyfill', './src/index.js'],

  // output options
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },

  // Don't bundle stuff from node_modules
  externals: [webpackNodeExternals()]
};


module.exports = merge(baseConfig, config);
