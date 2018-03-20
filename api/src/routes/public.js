import { healthCheck, rootRoute } from '../handlers/public';

export const initializePublicRoutes = (app) => {
  app.get('/health-check', healthCheck);
  app.get('/', rootRoute);
};
