import proxy from 'express-http-proxy';
import url from 'url';

import logger from '../utils/logger';

const log = logger.log('app:routes');

const apiProxyHost = process.env.PROXY_HOST || 'http://localhost:8000';
const authProxyHost = process.env.PROXY_HOST || 'http://localhost:8000';

const proxyConfig = (pathPrefix) => ({
  proxyReqOptDecorator(opts) {
    opts.headers['x-forwarded-host'] = 'localhost:3000';
    return opts;
  },
  proxyReqPathResolver: (req) => `${pathPrefix}${url.parse(req.url).path}`
});

export default function initializeProxyRoutes(router) {
  log('Initializing proxy routes');
  // router.use('/api', proxy(apiProxyHost, proxyConfig('/api')));
  // router.use('/auth', proxy(authProxyHost, proxyConfig('/auth')));
}
