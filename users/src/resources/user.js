import mongoose from 'mongoose';
import { /*requireUser, restrictToUser,*/ forbidden } from '../middleware/userRelations';
import { authenticateJWT } from '../handlers/auth';

import logger from '../utils/logger';

const log = logger.log('app:api:user');
log('Initializing User Resource');

export default {
  model: mongoose.model('User'),
  options: {// express-restify-mongoose options
    prefix: '',
    preMiddleware: [
      // requireUser,
      // restrictToUser('_id')
      authenticateJWT()
    ],
    preCreate: forbidden,
    preUpdate: forbidden,
    preDelete: forbidden
  }
};

