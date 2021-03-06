const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StringReplacePlugin = require('string-replace-webpack-plugin')
const NpmDtsPlugin = require('npm-dts-webpack-plugin')

const exportedConfig = {
  entry: __dirname + '/index.ts',
  target: 'node',
  devtool: 'inline-source-map',
  externals: [nodeExternals()],
  mode: 'development',
  plugins: [
    new NpmDtsPlugin({
      logLevel: 'debug',
    }),
  ],
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
    libraryTarget: 'umd',
  },
  resolveLoader: {
    modules: [__dirname + '/node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: __dirname + '/tsconfig.json',
            },
          },
        ],
      },
    ],
  },
}

module.exports = exportedConfig
