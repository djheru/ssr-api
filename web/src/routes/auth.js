import express from 'express';
import {
  authenticate,
  authCallback,
  redirect,
  logout
} from '../handlers/auth';

const router = express.Router();

export const initializeAuthRoutes = (app) => {
  router.get('/google', authenticate());
  router.get('/google/callback', authCallback(), redirect('/'));
  router.get('/logout', logout('/'));

  app.use('/auth', router);
};
