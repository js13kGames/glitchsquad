const path = require('path');
const dir = __dirname;
const webpack = require('webpack');
const Copy = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: path.resolve(dir, './src/'),
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  entry: {
	  client: path.resolve(dir, './src/shared.ts')
  },
  output: {
    library: 'glitchSquad',
    libraryTarget: "this",
    path: path.resolve(dir, './public'),
    publicPath: '/',
    filename: "shared.js"
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loaders: ['eslint'],
        include: path.resolve(dir, './src/')
      }
    ],
    loaders: [

      {test: /\.tsx?$/, loader: 'ts-loader'},
      //{test: /\.tsx?$/, loader: 'babel?presets[]=es2015!ts-loader'},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract(["css", "sass"])}
    ]
  },
  tslint: {
    emitErrors: true,
    failOnHint: true
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new Copy([
      {
        from: 'index.html'
      },
      {
        from: 'server.js'
      },
      {
	from: 'favicon.ico'
      }
    ])
  ]
};
