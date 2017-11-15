import React, { hydrate } from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const container = document.getElementById('app');

ReactDOM.hydrate(<App />, container);

if (module.hot) {
  module.hot.accept('./App.js', () => {
    const UpdatedApp = require('./App').default;
    ReactDOM.render(<UpdatedApp />, container);
  });
}
