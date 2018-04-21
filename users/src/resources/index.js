import express from 'express';
import restify from 'express-restify-mongoose';
import logger from '../utils/logger';

const apiRouter = express.Router();
const log = logger.log('app:api');

// Models to expose as resources
import Todo from './todo';
import User from './user';

/**
 * Turns models into REST resources
 * @param app
 */
export function initializeApi(app) {
  const resources = { Todo, User };

  Object.keys(resources)
    .forEach((resourceName) => {
      log(`Mounting API Resource: ${resourceName}`);

      const resource = resources[resourceName];
      restify.serve(apiRouter, resource.model, resource.options);
    });

  app.use('/api', apiRouter);
}
