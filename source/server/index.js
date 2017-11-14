import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.resolve(__dirname, '../../build')));

app.get('*', (req, res, next) => {
  try {
    res.status(200);
    res.send(`
      <!doctype html>
      <html lang="en">
      <head>
      </head>
      <body>
        <div id="test"></div>
        <script src="./js/client.js"></script>  
      </body>
      </html>
    `);
  } catch (error) {
    next(error)
  }
});

app.listen(3000, () => {
  console.info(`The server is running at http://localhost:3000/`);
});

export default app;
