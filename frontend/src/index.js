//imports for restoring and fetching the csrf token
import { restoreCSRF, csrfFetch } from './store/csrf';

//5 imports for Provider and BrowserRouter
import React from 'react';

import './index.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider, Modal } from "./context/Modal"
import App from './App';

import configureStore from './store';
import * as sessionActions from './store/session';

//6 create the store and expose it to the window only in development
const store = configureStore();



if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// 7 define a Root React functional component to return App wrapped in Redux's Provider
//and React Router DOM's BrowswerRouter
function Root() {
  return (
    <ModalProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Modal/>
      </BrowserRouter>
    </Provider>
    </ModalProvider>
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
