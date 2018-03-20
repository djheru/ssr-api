import npmConfig from '../../package.json';

export const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    version: npmConfig.version
  });
};

export const rootRoute = (req, res) => {
  res.json({ status: 'ohai!' });
};
