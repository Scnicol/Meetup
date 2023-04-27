//5 imports for Provider and BrowserRouter
import React from 'react';

import './index.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import configureStore from './store';

//6 create the store and expose it to the window only in development
const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

// 7 define a Root React functional component to return App wrapped in Redux's Provider
//and React Router DOM's BrowswerRouter
function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

// 8 pass in the Root component and the HTML element with the id of 'root'
//into the reactDom.render
ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
