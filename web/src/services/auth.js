import passport from 'passport';
import PassportGoogle from 'passport-google-oauth20';
// import mongoose from 'mongoose';
import logger from '../utils/logger';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const log = logger.log('app:server');
// const User = mongoose.model('User');
const GoogleStrategy = PassportGoogle.Strategy;

export const googlePermissionOptions = {
  accessType: 'offline',
  prompt: 'consent',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.readonly'
  ]
};

const googleConfig = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  options: googlePermissionOptions,
  proxy: true
};

const serializeUser = ({ id, accessToken = false, refreshToken = false}, done) => {
  const serializedUser = (accessToken && refreshToken) ? JSON.stringify({ accessToken, refreshToken }) : id;
  done(null, serializedUser);
};

export const deserializeUser = async (id, done) => {
  try {
    // const user = await User.findById(id).exec();
    done(null, id);
  } catch (e) {
    logger.error(e.message);
    done(e);
  }
};

export const updateUserProfile = async (accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  log('Updating user profile');
  log(accessToken);
  log(refreshToken);
  // log(profile);
  try {
    log(accessToken, refreshToken);
    // const user = await User.findOrCreateSocial(profile);
    done(null, profile);
  } catch (e) {
    logger.error(e.message);
    done(e);
  }
};

const authStrategy = new GoogleStrategy(googleConfig, updateUserProfile);

/**
 * Add the auth middleware
 * @param app - Express app
 */
export function initializeAuth(app) {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(authStrategy);
  app.use(passport.initialize());
  app.use(passport.session());
}