import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { configureStore } from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";

export const store = configureStore();

function tick() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
  );
}
setInterval(tick, 1);

serviceWorker.unregister();