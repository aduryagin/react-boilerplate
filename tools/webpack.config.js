import path from 'path';

const isDebug = !process.argv.includes('--release');

const commonConfig = {
  output: {
    publicPath: '/assets/',
    path: path.resolve(__dirname, '../build/assets')
  },
}

const clientConfig = {
  entry: {
    client: path.resolve(__dirname, '../source/client/index'),
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
            useBuiltIns: 'entry',
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
  entry: {
    server: path.resolve(__dirname, '../source/server/index')
  },

  target: 'node',

  ...commonConfig
}

export default [clientConfig, serverConfig];