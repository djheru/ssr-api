import passport from 'passport';
import { googlePermissionOptions } from '../services/auth';
import logger from '../utils/logger';

const log = logger.log('app:handlers:auth');
const cookieDuration = 1000 * 60 * 60 * 24 * 7;

export const authenticate = () =>
  passport.authenticate('google', googlePermissionOptions);

export const authCallback = () =>
  passport.authenticate('google');

export const redirect = (route = '/') =>
  (req, res) => {
    res.redirect(route);
  };

export const logout = (route = '/') => (req, res) => {
  req.logout();
  res.clearCookie('token');
  res.redirect(route);
};
