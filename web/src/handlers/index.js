import { matchRoutes } from 'react-router-config';
import renderer from '../renderMarkup';
import createStore from '../createStore';
import routes from '../client/routes';

export default async function defaultRouteHandler(req, res) {
  const store = await createStore(req);
  const context = {};

  try {
    const matchedRoutes = matchRoutes(routes, req.path);
    const promises = matchedRoutes
      .map(({ route: { loadData = false } }) => (loadData ? loadData(store) : null))
      .map(promise => {
        if (promise) {
          return new Promise((resolve) => { // wrap the loadData functions in a promise and resolve no matter what
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
}
