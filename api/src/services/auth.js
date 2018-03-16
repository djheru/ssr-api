import passport from 'passport';
import PassportGoogle from 'passport-google-oauth20';
import mongoose from 'mongoose';
import logger from '../utils/logger';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const log = logger.log('app:server');
const User = mongoose.model('User');
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
  callbackURL: '/api/auth/google/callback',
  options: googlePermissionOptions
};

const serializeUser = (user, done) => {
  done(null, user.id);
};

export const deserializeUser = async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (e) {
    logger.error(e.message);
    done(e);
  }
};

export const updateUserProfile = async (accessToken, refreshToken, profile, done) => {
  log('Updating user profile');
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  try {
    const user = await User.findOrCreateSocial(profile);
    done(null, user);
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
