import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config'
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import reducers from './reducers';
import routes from './routes';

const httpClient = axios.create({
  baseURL: '/api/v1'
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = applyMiddleware(thunk.withExtraArgument(httpClient));
const store = createStore(reducers, window.INITIAL_STATE || {}, composeEnhancers(middleware));

const browserRouter = (
  <Provider store={ store }>
    <BrowserRouter>
      <div>{ renderRoutes(routes) }</div>
    </BrowserRouter>
  </Provider>
);

ReactDOM.hydrate(browserRouter, document.querySelector('#root'));
