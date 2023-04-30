import sessionReducer from './session';
import groupReducer from './groups';
import eventReducer from './events';

//1 imports for setting up the store
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';


//2 create rootReducer
const rootReducer = combineReducers({
    session: sessionReducer,
    groups: groupReducer,
    events: eventReducer
});

//3 set up the enhancer and logger
let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

//4 configure the store for use
const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore
