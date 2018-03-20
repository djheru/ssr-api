import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducers from './client/reducers';

const HOST = process.env.HOST || 'localhost:8000';
const PROTOCOL = process.env.PROTOCOL || 'http';

export default (req) => {
  const serverHttpClient = axios.create({
    baseURL: `${PROTOCOL}://${HOST}`,
    headers: { cookie: req.get('cookie') || '' }
  });

  const thunkMiddleware = thunk.withExtraArgument(serverHttpClient);
  return createStore(reducers, {}, applyMiddleware(thunkMiddleware));
}
