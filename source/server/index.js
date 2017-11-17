import express from 'express';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import AppComponent from '../client/App';

const app = express();

app.use(express.static(path.resolve(__dirname, '../../build')));

app.get('*', (req, res, next) => {
  try {
    res.write(`<!doctype html>${require('./test').default}<html lang="en"><head></head><body><div id="app">`);

    const stream = ReactDOMServer.renderToNodeStream(<AppComponent/>);
    stream.pipe(res, { end: false });
    stream.on('end', () => {
      res.write(`</div><script src="./js/client.js"></script></body></html>`);
      res.end();
    });
  } catch (error) {
    next(error);
  }
});

if (module.hot) {
  module.hot.accept('./test');
  app.hot = module.hot;
} else {
  app.listen(3000, () => {
    console.info(`The server is running at http://localhost:3000/`);
  });
}

export default app;
