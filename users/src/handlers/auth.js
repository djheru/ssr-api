import passport from 'passport';
import { googlePermissionOptions } from '../services/auth';
import logger from '../utils/logger';

const log = logger.log('app:handlers:auth');

export const authenticateJWT = () => [
  (req, res, next) => {
    log(req.headers);
    next();
  },
  passport.authenticate('jwt', { session: false })
];

export const authenticateGoogle = () =>
  passport.authenticate('google', googlePermissionOptions);

export const authenticateGoogleCallback = () =>
  passport.authenticate('google');

export const redirect = (route = '/') =>
  (req, res) => {
    res.redirect(route);
  };

export const logout = (route = '/') => (req, res) => {
  req.logout();
  res.redirect(route);
};
