import {
  authCallback,
  redirect,
  logout,
  currentUser
} from './handlers/auth';
import { authenticateGoogle } from '../services/auth';

export const initializeAuthRoutes = (app) => {
  app.get('/auth/google', authenticateGoogle());
  app.get('/auth/google/callback', authCallback(), redirect('/'));
  app.get('/logout', logout('/'));
  app.get('/current-user', currentUser());
};
