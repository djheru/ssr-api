import {
  authenticate,
  authCallback,
  redirect,
  logout
} from './handlers/auth';

export const initializeAuthRoutes = (app) => {
  app.get('/auth/google', authenticate());
  app.get('/auth/google/callback', authCallback(), redirect('/'));
  app.get('/logout', logout('/'));
};
