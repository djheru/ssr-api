import express from 'express';
import morgan from 'morgan';

import logger from '../utils/logger';

const log = logger.log('app:middleware');

export default function initializeMiddleware(app) {
  log('Initializing Middleware');
  app.disable('x-powered-by');
  app.use(morgan('dev', { skip: () => app.get('env') === 'test' }));
  app.use(express.static('public'));
}
