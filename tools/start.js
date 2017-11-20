import webpack from 'webpack';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import browserSync from 'browser-sync';
import express from 'express';
import path from 'path';
import clean from './clean';
import webpackConfig from './webpack.config';

let server;

const start = () => {
  if (server) return server;

  server = express();
  server.use(errorOverlayMiddleware());
  server.use(express.static(path.resolve(__dirname, '../build')));

  // Clean js directory

  clean(path.resolve(__dirname, '../build/js/*'));

  const defaultDevPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  ];

  const clientConfig = webpackConfig.find(config => config.name === 'client');
  const serverConfig = webpackConfig.find(config => config.name === 'server');

  clientConfig.plugins = [ ...clientConfig.plugins, ...defaultDevPlugins];
  serverConfig.plugins = [ ...serverConfig.plugins, ...defaultDevPlugins];

  // Connect a browser client to a server through WS (client config)

  clientConfig.entry.client.unshift('webpack-hot-middleware/client');

  // Start the compilation process

  const multiCompiler = webpack(webpackConfig);
  const clientCompiler = multiCompiler.compilers.find(compiler => compiler.name === 'client');
  const serverCompiler = multiCompiler.compilers.find(compiler => compiler.name === 'server');

  // Get files from the memory

  server.use(webpackDevMiddleware(clientCompiler, {
    watchOptions: {},
    publicPath: clientConfig.output.publicPath
  }));

  // Connect a browser client to a server through WS (server config)
  
  server.use(webpackHotMiddleware(clientCompiler, { log: false }));

  let browserSyncServer;
  let app;

  serverCompiler.watch({
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  }, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    if (app) {
      // Test all loaded modules for updates and, if updates exist, apply them

      const hmrPrefix = '[\x1b[35mHMR\x1b[0m] ';
      app.hot.check(true).then(updatedModules => {
        if (updatedModules) {
          if (updatedModules.length === 0) {
            console.info(`${hmrPrefix}Nothing hot updated.`);
          } else {
            console.info(`${hmrPrefix}Updated modules:`);
            updatedModules.forEach(moduleId => {
              console.info(`${hmrPrefix} ${moduleId}`);
            });

            if (updatedModules.length === 1 && updatedModules[0].includes('server')) {
              // Reload all browsers if only server was changed

              browserSyncServer.publicInstance.reload();
            }
          }
        }
      }).catch(error => {
        if (['abort', 'fail'].includes(app.hot.status())) {
          console.warn(`${hmrPrefix}Cannot apply update.`);
        } else {
          console.warn(`${hmrPrefix}Update failed: ${error.stack || error.message}`);
        }
      });
    }

    if (!browserSyncServer) {
      app = require('../build/js/server').default;
      server.use((req, res) => app.handle(req, res));
  
      browserSyncServer = browserSync.create().init({
        server: path.resolve(__dirname, '../build/'),
        logPrefix: 'React boilerplate',
        middleware: [server],
        open: 'local',
        logLevel: 'info',
        notify: false,
        ui: false,
        online: true,
      });
    }
  });
}

start();