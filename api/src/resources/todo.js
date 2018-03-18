import mongoose from 'mongoose';
import { addResultToUser, addUserToBody, restrictToUser } from '../middleware/userRelations';
import { authenticateJwt } from '../services/auth';
import logger from '../utils/logger';

const log = logger.log('app:api:todo');
log('Initializing Todo resource');
export default {
  model: mongoose.model('Todo'),
  options: {// express-restify-mongoose options
    prefix: '',
    preMiddleware: [
      authenticateJwt(),
      restrictToUser()
    ],
    preCreate: addUserToBody,
    postCreate: addResultToUser('todos'),
    findOneAndUpdate: false,
    findOneAndRemove: false
  }
};

