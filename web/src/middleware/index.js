import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

const { COOKIE_KEY } = process.env;

import logger from '../utils/logger';

const log = logger.log('app:middleware');

export default function initializeMiddleware(app) {
  log('Initializing Middleware');
  app.disable('x-powered-by');
  app.use(cookieParser());
  app.use(morgan('dev', { skip: () => app.get('env') === 'test' }));
  app.use(express.static('public'));
  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [COOKIE_KEY]
    })
  );
  app.use((req, res, next) => {
    log(req.cookies);
    next();
  });
}
