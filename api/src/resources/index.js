import express from 'express';
import restify from 'express-restify-mongoose';
import logger from '../utils/logger';

// Models to expose as resources
import Todo from './todo';

const apiRouter = express.Router(); // eslint-disable-line new-cap
const log = logger.log('app:api');

/**
 * Turns models into REST resources
 * @param app
 */
export function initializeApi(app) {
  const resources = { Todo };

  Object.keys(resources)
    .forEach((resourceName) => {
      const resource = resources[resourceName];
      log(`Initializing API Resource: ${resourceName}`);
      restify.serve(apiRouter, resource.model, resource.options);
    });

  app.use('/api', apiRouter);
}
