import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import Quiz from './Quiz';
import registerServiceWorker from './registerServiceWorker';

const rootEl = document.getElementById('root')

ReactDOM.render(
  <Quiz />,
  rootEl
)
if (module.hot) {
  module.hot.accept('./Quiz', () => {
    const NextApp = require('./Quiz').default
    ReactDOM.render(
      <NextApp />,
      rootEl
    )
  })
}


registerServiceWorker();