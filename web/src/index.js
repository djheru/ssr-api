import initializeApplication from './app';

import logger from './utils/logger';

const log = logger.log('app:server');

const { PORT = 3000, HOST = '0.0.0.0' } = process.env;
log('Begin Application Startup');

async function main() {
  try {
    log('Starting Server');
    const app = await initializeApplication();
    app.listen(PORT, HOST, () => logger.appStarted(PORT, HOST));
    return app;
  } catch (e) {
    logger.error(e);
    return false;
  }
}

const app = main();
export default async () => app;
