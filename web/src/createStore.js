import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducers from './client/reducers';
import logger from './utils/logger';


const {API_HOST, COOKIE_KEY} = process.env;
const log = logger.log('app:client:createStore');

export default async (req) => {
  const headers = {};
  const baseURL = `${API_HOST}/api/v1`;

  if (req.user && req.user.token) {
    log('Adding auth token to axios');
    headers.Authorization = `Bearer ${req.user.token || ''}`;
  }

  const serverHttpClient = axios.create({ baseURL, headers });

  const thunkMiddleware = thunk.withExtraArgument(serverHttpClient);
  return createStore(reducers, {}, applyMiddleware(thunkMiddleware));
}
