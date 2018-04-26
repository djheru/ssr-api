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
    if (req.user && req.user.jwt) {
      const cookieParams = {
        maxAge: cookieDuration,
        expires: new Date(Date.now() + cookieDuration)
      };
      res
        .cookie('jwt', req.user.jwt, cookieParams)
        .status(200)
        .redirect(route)
    } else {
      res
        .status(200)
        .redirect(route);
    }
  };

export const logout = (route = '/') => (req, res) => {
  req.logout();
  res.clearCookie('jwt');
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect(route);
};
