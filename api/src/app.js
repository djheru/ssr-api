import express from 'express';
import logger from './utils/logger';
import './models';

import { initializeMongoDb } from './persistence/mongoDb';
import { initializeMiddleware } from './middleware/index';
import { initializeAuth } from './services/auth';
import { initializeAuthRoutes } from './routes/auth';
import { initializePublicRoutes } from './routes/public';

const log = logger.log('app:server');
log('process.env', process.env);

/**
 * Sets up the express app with mongodb connection, middleware, auth, routes and resources
 *
 * @returns {Promise.<*|Function>} Configured express app
 */
async function initializeApplication() {
  log('Initializing Application');
  const app = express();

  await initializeMongoDb();
  initializeMiddleware(app);
  initializeAuth(app);
  initializeAuthRoutes(app);
  initializePublicRoutes(app);

  return app;
}

export default initializeApplication;
