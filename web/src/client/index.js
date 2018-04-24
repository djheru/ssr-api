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
import Cookie from 'js-cookie';

const token = Cookie.get('session');

const httpClient = axios.create({
  baseURL: API_HOST + '/api/v1',
  headers: { Authorization: `Bearer ${token || ''}` }
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
