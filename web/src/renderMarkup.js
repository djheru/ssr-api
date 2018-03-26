import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';
import { renderRoutes } from 'react-router-config';
import routes from './client/routes';

export default function rendereMarkup({ path }, store, context) {
  const content = renderToString(
    <Provider store={ store }>
      <StaticRouter location={ path } context={ context }>
        <div>{ renderRoutes(routes) }</div>
      </StaticRouter>
    </Provider>
  );

  const helmet = Helmet.renderStatic();
  const initialState = store.getState();

  return `
<html>
    <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    </head>
    <body>
      <div id="root">${content}</div>
      <script>
        window.INITIAL_STATE = ${serialize(initialState)}
      </script>
      <script src="bundle.js"></script>
    </body>
</html>
`;
}
