import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducers from './client/reducers';
import logger from './utils/logger';

const log = logger.log('app:client:createStore');

export default (req) => {
  log(req.cookies.session);
  const serverHttpClient = axios.create({
    baseURL: API_HOST + '/api/v1',
    headers: { cookie: req.get('cookie') || '' }
  });

  const thunkMiddleware = thunk.withExtraArgument(serverHttpClient);
  return createStore(reducers, {}, applyMiddleware(thunkMiddleware));
}
