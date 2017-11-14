import print from './print';

const printToHTML = (text) => {
  document.getElementById('test').innerHTML = text || print;
}

printToHTML();

if (module.hot) {
  module.hot.accept('./print.js', () => {
    printToHTML(require('./print').default);
  });
}
