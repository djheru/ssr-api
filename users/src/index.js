import 'dotenv/config';
import initializeApplication from './app';

import logger from './utils/logger';

const log = logger.log('app:server');

const { PORT = 8000, HOST = '0.0.0.0' } = process.env;

log('initializing application');

/**
 * Initializes the express app and listens on the host/port specified in the environment config
 *
 * @returns {Promise.<*>}
 */
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
