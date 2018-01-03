import * as path from 'path';
import * as webpack from 'webpack';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

// There are no types for this package
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function transformManifest(content: string): string {
  const manifest = JSON.parse(content);

  const packageData = require('./package.json');

  manifest.version = packageData.version;
  manifest.author = packageData.author;
  manifest.homepage_url = packageData.repository;

  return JSON.stringify(manifest, null, 2);
}

const config = {
  entry: {
    content: path.resolve(__dirname, 'src/content/index.ts'),
    background: path.resolve(__dirname, 'src/background/index.ts'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/js'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      packageData: JSON.stringify(require('./package.json')),
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static/manifest.json'),
        to: path.resolve(__dirname, 'build'),
        transform: transformManifest,
      },
      {
        from: path.resolve(__dirname, 'icons'),
        to: path.resolve(__dirname, 'build/icons'),
      },
      {
        from: path.resolve(__dirname, 'src/vendor/browser-polyfill.js'),
        to: path.resolve(__dirname, 'build/js'),
      },
    ]),
    new UglifyJsPlugin(),
  ]
};

export default config;
