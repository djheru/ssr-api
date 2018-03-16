import npmConfig from '../../package.json';

export const initializePublicRoutes = (app) => {
  app.get('/health-check', (req, res) => {
    res.json({
      status: 'ok',
      version: npmConfig.version
    });
  });

  app.get('/', (req, res) => {
    res.json({ status: 'ohai!' });
  });
};
