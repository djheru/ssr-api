import { healthCheck, rootRoute } from '../handlers/public';

export const initializePublicRoutes = (app) => {
  app.get('/api/health-check', healthCheck);
  app.get('/auth/health-check', healthCheck);
  app.get('/health-check', healthCheck);
  app.get('/', rootRoute);
};
