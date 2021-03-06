import express from 'express';
import logger from './utils/logger';
import './models';

import { initializeMongoDb } from './persistence/mongoDb';
import { initializeMiddleware } from './middleware/index';
import { initializeAuth } from './services/auth';
import { initializeAuthRoutes } from './routes/auth';

const log = logger.log('app:server');
log('process.env', process.env);

async function initializeApplication() {
  log('Initializing Application');
  const app = express();

  await initializeMongoDb();
  initializeMiddleware(app);
  initializeAuth(app);
  initializeAuthRoutes(app);

  return app;
}

export default initializeApplication;
