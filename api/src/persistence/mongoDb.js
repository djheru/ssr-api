import mongoose from 'mongoose';
import logger from '../utils/logger';

const log = logger.log('app:mongoDb');
const { MONGO_URI: dbUrl } = process.env;

mongoose.Promise = global.Promise;

export async function initializeMongoDb() {
  mongoose.connection.on('connected', () => {
    log(`Mongoose connected to ${dbUrl}`);
  });

  mongoose.connection.on('error', (err) => {
    log(`Mongoose connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    log('Mongoose disconnected');
  });

  // CAPTURE APP TERMINATION / RESTART EVENTS
  // To be called when process is restarted or terminated
  function gracefulShutdown(msg, callback) {
    mongoose.connection.close(() => {
      log(`Mongoose disconnected through ${msg}`);
      callback();
    });
  }

  // For nodemon restarts
  process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });

  // For app termination
  process.on('SIGINT', () => {
    gracefulShutdown('App termination (SIGINT)', () => {
      process.exit(0);
    });
  });

  // For Heroku app termination
  process.on('SIGTERM', () => {
    gracefulShutdown('App termination (SIGTERM)', () => {
      process.exit(0);
    });
  });

  try {
    return await mongoose.connect(dbUrl);
  } catch (e) {
    log('MongoDB connection error');
    logger.error(e);
    return false;
  }
}
