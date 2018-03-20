import {
  authenticate,
  authCallback,
  redirect,
  logout,
} from './handlers/auth';

export const initializeAuthRoutes = (app) => {
  app.get('/google', authenticate());
  app.get('/google/callback', authCallback(), redirect('/'));
  app.get('/api/auth/google/callback', authCallback(), redirect('/'));
  app.get('/logout', logout('/'));
};
