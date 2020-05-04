import * as path from 'path';
import * as webpack from 'webpack';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

function transformManifest(content: Buffer): string {
  const manifest = JSON.parse(content.toString());

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageData = require('./package.json');

  manifest.name = packageData.productName;
  manifest.description = packageData.description;
  manifest.version = packageData.version;
  manifest.author = packageData.author;

  // eslint-disable-next-line @typescript-eslint/camelcase
  manifest.homepage_url = packageData.repository;

  return JSON.stringify(manifest, null, 2);
}

const config = {
  entry: {
    background: path.resolve(__dirname, 'src/background/index.ts'),
    content: path.resolve(__dirname, 'src/content/index.ts'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/js'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
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
        loader: 'string-replace-loader',
        options: {
          multiple: [
            {
              search: 'sourceMappingURL',
              replace: 'disabledSourceMappingURL',
            },
          ],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // eslint-disable-next-line @typescript-eslint/no-var-requires
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
        from: path.resolve(__dirname, 'LICENSE'),
        to: path.resolve(__dirname, 'build'),
      },
    ]),
  ],
};

export default config;
