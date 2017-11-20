import path from 'path';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import externals from 'webpack-node-externals';

const isDebug = !process.argv.includes('--release');

const commonConfig = {
  output: {
    publicPath: '/js/',
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug ? 'chunks/[name].chunk.js' : 'chunks/[name].[chunkhash:8].chunk.js',
    path: path.resolve(__dirname, '../build/js'),
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: isDebug,
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
    }),
  ],

  module: {
    rules: [{
      test: /\.js/,
      include: path.resolve(__dirname, '../source/'),
      loader: 'babel-loader',
      options: {
        cacheDirectory: isDebug,
        babelrc: false,
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: '> 1%, not ie 11',
            },
            modules: false,
            useBuiltIns: 'usage',
            loose: true,
            forceAllTransforms: !isDebug,
            debug: isDebug,
          }],
          ['@babel/preset-stage-2', {
            useBuiltIns: true,
            loose: true,
          }],
          ['@babel/preset-react', {
            useBuiltIns: true,
            development: isDebug,
          }],
        ],
      },
    }],
  },
};

const clientConfig = {
  ...commonConfig,

  name: 'client',

  entry: {
    client: [path.resolve(__dirname, '../source/client/index')],
  },

  target: 'web',

  plugins: [
    ...commonConfig.plugins,

    ...isDebug ? [] : [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new UglifyJsPlugin({
        parallel: true,
      }), // TODO: source maps
    ],
  ],
};

const serverConfig = {
  ...commonConfig,

  output: {
    ...commonConfig.output,
    libraryTarget: 'commonjs',
  },

  name: 'server',

  module: {
    rules: [{
      ...commonConfig.module.rules[0],
      options: {
        ...commonConfig.module.rules[0].options,
        presets:
          commonConfig.module.rules[0].options.presets.map(preset => (
            preset[0] !== '@babel/preset-env'
              ? preset
              : ['@babel/preset-env', {
                targets: {
                  node: 'current',
                },
                modules: false,
                useBuiltIns: false,
                debug: false,
              }]
          )),
      },
    }],
  },

  entry: {
    server: path.resolve(__dirname, '../source/server/index'),
  },

  target: 'node',

  externals: [externals({
    importType: 'commonjs2',
  })],
};

export default [clientConfig, serverConfig];
