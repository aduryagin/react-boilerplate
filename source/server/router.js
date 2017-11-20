import { Router } from 'express';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import AppComponent from '../client/App';

const applicationRouter = Router();

applicationRouter.get('*', (req, res, next) => {
  try {
    res.write('<!doctype html><html lang="en"><head></head><body><div id="app">');
    const stream = ReactDOMServer.renderToNodeStream(<AppComponent />);
    stream.pipe(res, { end: false });
    stream.on('end', () => {
      res.write('</div><script src="./js/client.js"></script></body></html>');
      res.end();
    });
  } catch (error) {
    next(error);
  }
});

export default applicationRouter;
