import express from 'express';
import {
  authenticateGoogle,
  authenticateGoogleCallback,
  redirect,
  logout
} from '../handlers/auth';

const router = express.Router();

export const initializeAuthRoutes = (app) => {
  router.get('/google', authenticateGoogle());
  router.get('/google/callback', authenticateGoogleCallback(), redirect('/'));
  router.get('/logout', logout('/'));

  app.use('/auth', router);
};
