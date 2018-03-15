import passport from 'passport';
import { googlePermissionOptions } from '../services/auth';

export const initializeAuthRoutes = (app) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', googlePermissionOptions)
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get(
    '/api/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/current-user', (req, res) => {
    res.json(req.user);
  });
};
