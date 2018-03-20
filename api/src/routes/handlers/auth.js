import passport from 'passport';
import { googlePermissionOptions } from '../../services/auth';

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
  res.redirect(route);
};
