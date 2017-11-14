import webpack from 'webpack';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import browserSync from 'browser-sync';
import express from 'express';
import path from 'path';
import app from '../source/server';
import clean from './clean';
import webpackConfig from './webpack.config';

let server;

const start = () => {
  if (server) return server;

  server = express();
  server.use(errorOverlayMiddleware());
  server.use(express.static(path.resolve(__dirname, '../build')));

  // Clean js directory

  clean(path.resolve(__dirname, '../build/js/*.js'));

  const defaultDevPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  ];

  const clientConfig = webpackConfig.find(config => config.target === 'web');
  const serverConfig = webpackConfig.find(config => config.target === 'node');
  
  clientConfig.plugins = defaultDevPlugins;
  serverConfig.plugins = defaultDevPlugins;

  // Connect a browser client to a server through WS (client config)

  clientConfig.entry.client.unshift('webpack-hot-middleware/client');

  // Start the compilation process
  
  const multiCompiler = webpack(webpackConfig);
  const clientCompiler = multiCompiler.compilers.find(compiler => compiler.name === 'client');

  // Get files from the memory

  server.use(webpackDevMiddleware(clientCompiler, {
    watchOptions: {},
    publicPath: clientConfig.output.publicPath
  }));

  // Connect a browser client to a server through WS (server config)

  server.use(webpackHotMiddleware(clientCompiler));

  server.use((req, res) => {
    app.handle(req, res);
  });

  browserSync.create().init({
      server: path.resolve(__dirname, '../build/'),
      logPrefix: 'React boilerplate',
      middleware: [server],
      open: 'local',
      logLevel: 'info',
      notify: false,
      ui: false,
      online: true,
    },
  );
};

start();
