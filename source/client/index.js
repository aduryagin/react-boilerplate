import React from 'react';
import { hydrate, render } from 'react-dom';
import App from './App';

const container = document.getElementById('app');

hydrate(<App />, container);

if (module.hot) {
  module.hot.accept('./App.js', () => {
    // eslint-disable-next-line global-require
    const UpdatedApp = require('./App').default;
    render(<UpdatedApp />, container);
  });
}
