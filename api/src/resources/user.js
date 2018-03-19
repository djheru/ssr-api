import mongoose from 'mongoose';
import { requireUser, restrictToUser, forbidden } from '../middleware/userRelations';

import logger from '../utils/logger';

const log = logger.log('app:api:user');
log('Initializing User resource');

export default {
  model: mongoose.model('User'),
  options: {// express-restify-mongoose options
    prefix: '',
    preMiddleware: [
      requireUser,
      restrictToUser('_id')
    ],
    preCreate: forbidden,
    preUpdate: forbidden,
    preDelete: forbidden
  }
};

