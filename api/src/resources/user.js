import mongoose from 'mongoose';
import { forbidden, restrictToUser } from '../middleware/userRelations';
import { authenticateJwt } from '../services/auth';
import logger from '../utils/logger';

const log = logger.log('app:api:user');
log('Initializing User resource');
export default {
  model: mongoose.model('User'),
  options: {// express-restify-mongoose options
    prefix: '',
    preMiddleware: [
      authenticateJwt(),
      restrictToUser('_id')
    ],
    preCreate: forbidden,
    preUpdate: forbidden,
    preDelete: forbidden,
    findOneAndUpdate: false,
    findOneAndRemove: false
  }
};

