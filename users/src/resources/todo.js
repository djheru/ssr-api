import mongoose from 'mongoose';
import { addResultToUser, addUserToBody, /*requireUser, restrictToUser*/ } from '../middleware/userRelations';
import { authenticateJWT } from '../handlers/auth';
import logger from '../utils/logger';

const log = logger.log('app:api:todo');
log('Initializing Todo Resource');

export default {
  model: mongoose.model('Todo'),
  options: {// express-restify-mongoose options
    prefix: '',
    preMiddleware: [
      authenticateJWT()
    ],
    preCreate: addUserToBody,
    postCreate: addResultToUser('todos'),
    findOneAndUpdate: false,
    findOneAndRemove: false
  }
};

