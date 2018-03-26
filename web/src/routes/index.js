import express from 'express';
import initializeProxyRoutes from './proxy';
import defaultRouteHandler from '../handlers';

function initializeDefaultRoutes(router) {
  router.get('*', defaultRouteHandler);
}

export default function initializeRoutes(app) {
  const router = express.Router();

  initializeProxyRoutes(router);
  initializeDefaultRoutes(router);

  app.use('/', router);
}
