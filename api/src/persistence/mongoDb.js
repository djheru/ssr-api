import mongoose from 'mongoose';
import logger from '../utils/logger';

const log = logger.log('app:mongoDb');
const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_HOST_A,
  MONGO_HOST_B,
  MONGO_HOST_C
} = process.env;

const credentials = `${MONGO_USER}:${MONGO_PASS}`;
const hosts = `${MONGO_HOST_A},${MONGO_HOST_B},${MONGO_HOST_C}`;
const db = 'ssr_api';
const params = 'ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

const dbUrl = `mongodb://${credentials}@${hosts}/${db}?${params}`;
console.log(dbUrl);
mongoose.Promise = global.Promise;

/**
 * Set up the mongodb connection and disconnect handlers
 *
 * @returns {Promise.<*>}
 */
export async function initializeMongoDb() {
  mongoose.connection.on('connected', () => {
    log(`Mongoose Connected`);
  });

  mongoose.connection.on('error', (err) => {
    log(`Mongoose connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    log('Mongoose disconnected');
  });

  /**
   * Capture app termination and restart events
   *
   * @param msg
   * @param callback
   */
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
