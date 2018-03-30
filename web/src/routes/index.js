import express from 'express';
import initializeProxyRoutes from './proxy';
import defaultRouteHandler from '../handlers';
import logger from '../utils/logger';

const log = logger.log('app:routes:default');

function initializeDefaultRoutes(router) {
  router.get('*', defaultRouteHandler);
}

export default function initializeRoutes(app) {
  const router = express.Router();

  if (process.env.NODE_ENV === 'development') {
    log('Initializng Proxy Routes')
    initializeProxyRoutes(router);
  }
  initializeDefaultRoutes(router);

  app.use('/', router);
}
