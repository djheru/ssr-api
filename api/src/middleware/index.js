import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

const { COOKIE_KEY } = process.env;

/**
 * Sets up the express middleware
 *
 * @param app - Express app
 */
export function initializeMiddleware(app) {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [COOKIE_KEY]
    })
  );
  app.use(morgan('dev', {
    skip: () => app.get('env') === 'test'
  }));
}
