import express from 'express';
import path from 'path';

const app = express();
let router = require('./router').default;

app.use(express.static(path.resolve(__dirname, '../../build')));
app.use((req, res, next) => {
  router(req, res, next);
});

if (module.hot) {
  module.hot.accept('./router', () => {
    // eslint-disable-next-line global-require
    router = require('./router').default;
  });
  app.hot = module.hot;
} else {
  app.listen(3000, () => {
    console.info('The server is running at http://localhost:3000/');
  });
}

export default app;
