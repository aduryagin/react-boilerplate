import path from 'path';
import webpack from 'webpack';

const isDebug = !process.argv.includes('--release');

const commonConfig = {
  output: {
    publicPath: '/js/',
    path: path.resolve(__dirname, '../build/js')
  },
}

const clientConfig = {
  name: 'client',

  entry: {
    client: [ path.resolve(__dirname, '../source/client/index') ],
  },

  target: 'web',

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
              browsers: '> 1%, not ie 11'
            },
            modules: false,
            useBuiltIns: 'usage',
            loose: true,
            forceAllTransforms: !isDebug,
            debug: isDebug
          }],
          ['@babel/preset-stage-2', {
            useBuiltIns: true,
            loose: true
          }]
        ]
      }
    }]
  },

  ...commonConfig
};

const serverConfig = {
  name: 'server',

  entry: {
    server: path.resolve(__dirname, '../source/server/index')
  },

  target: 'node',

  ...commonConfig
}

export default [clientConfig, serverConfig];