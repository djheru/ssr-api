import {
  authenticate,
  authCallback,
  redirect,
  logout,
  currentUser
} from './handlers/auth';

export const initializeAuthRoutes = (app) => {
  app.get('/auth/google', authenticate());
  app.get('/auth/google/callback', authCallback(), redirect('/'));
  app.get('/api/auth/google/callback', authCallback(), redirect('/'));
  app.get('/logout', logout('/'));
  app.get('/current-user', currentUser());
};
