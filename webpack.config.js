const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const dev = process.env.NODE_ENV === 'dev';

const config = {
  entry: ['./src/main.js'],
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve('./src')],
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
  ],
};

if (!dev) {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
  }));

config.plugins.push(new UglifyJSPlugin({
    sourceMap: false,
  }));
}

module.exports = config;
