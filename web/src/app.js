import express from 'express';
import logger from './utils/logger';

import initializeMiddleware from './middleware';
import initializeRoutes from './routes';

const log = logger.log('app:server');

async function initializeApplication() {
  log('Initializing Application');

  const app = express();
  initializeMiddleware(app);
  initializeRoutes(app);

  return app;
}

export default initializeApplication;
