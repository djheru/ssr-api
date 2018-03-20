import 'babel-polyfill';
import proxy from 'express-http-proxy';
import express from 'express';
import morgan from 'morgan';
import { matchRoutes } from 'react-router-config';
import routes from './client/routes';
import renderer from './renderMarkup';
import createStore from './createStore';
import url from 'url';

const app = express();
app.use('/api', proxy('http://localhost:8000', {
  proxyReqOptDecorator(opts) {
    opts.headers['x-forwarded-host'] = 'localhost:3000';
    return opts;
  },
  proxyReqPathResolver: (req) => `/api/${url.parse(req.url).path}`
}));
app.use('/auth', proxy('http://localhost:8000', {
  proxyReqOptDecorator(opts) {
    opts.headers['x-forwarded-host'] = 'localhost:3000';
    return opts;
  },
  proxyReqPathResolver: (req) => `/auth/${url.parse(req.url).path}`
}));

app.use(morgan('dev', {
  skip: () => app.get('env') === 'test'
}));

app.use(express.static('public'));

app.get('*', async (req, res) => {
  const store = createStore(req);
  const context = {};

  try {
    const matchedRoutes = matchRoutes(routes, req.path);
    const promises = matchedRoutes
      .map(({ route: { loadData = false } }) => (loadData ? loadData(store) : null))
      .map(promise => {
        if (promise) {
          return new Promise((resolve) => {
            promise.then(resolve).catch(resolve);
          });
        }
      });
    await Promise.all(promises);
    const content = renderer(req, store, context);
    if (context.url) {
      return res.redirect(301, context.url);
    }
    if (context.notFound) { // context is set by reference in the NotFoundPage
      res.status(404);
    }
    res.send(content);
  } catch (e) {
    console.log(e.message);

  }
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
