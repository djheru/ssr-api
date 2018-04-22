import mongoose from 'mongoose';
import logger from '../utils/logger';

const log = logger.log('app:middleware');

/**
 * Adds the authenticated user's _id to the body of the request
 * @param req
 * @param res
 * @param next
 */
export function addUserToBody(req, res, next) {
  if (req.body && req.user && req.user._id) {
    req.body.user = req.user._id;
  }
  next();
}

/**
 * Restricts resources to those that have a value for the "userKey" property matching the authenticated user
 * e.g. "return only Todos owned by the user"
 * @param userKey
 */
export const restrictToUser = (userKey = 'user') => (req, res, next) => {
  const query = (req.query && Object.prototype.hasOwnProperty.call(req.query, 'query')) ?
    JSON.parse(req.query.query) : {};
  query[userKey] = req.user._id;
  req.query.query = JSON.stringify(query);
  req._ermQueryOptions = Object.assign({}, req._ermQueryOptions, { query });
  next();
};

/**
 * Adds a reference to the resource in the user document
 * @param resultField
 */
export const addResultToUser = (resultField) => async (req, res, next) => {
  log(`Adding a ${resultField} reference to the user`);
  const User = mongoose.model('User');
  const resultId = req.erm.result._id;
  try {
    const user = await User.findById(req.user._id);
    if (!user[resultField]) {
      user[resultField] = [];
    }
    user[resultField].push(resultId);
    await user.save();
    next();
  } catch (e) {
    log(e);
    next(e);
  }
};

/**
 * Returns a 401 response if the user is not authenticated
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  } else {
    log('User authenticated');
  }
  return next();
}

/**
 * You're not allowed to do that yo
 * @param req
 * @param res
 */
export function forbidden(req, res) {
  res.sendStatus(403);
}
