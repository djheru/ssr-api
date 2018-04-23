import passport from 'passport';
import PassportGoogle from 'passport-google-oauth20';
// import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

const { COOKIE_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const log = logger.log('app:services:auth');
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
  ],
  session: true
};

const googleConfig = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  options: googlePermissionOptions,
  //proxy: true
};

const serializeUser = ({ id:googleId, accessToken = false, refreshToken = false}, done) => {
  log('serialize');
  const serializedUser = (accessToken && refreshToken) ? { accessToken, refreshToken, googleId } : { googleId };
  done(null, JSON.stringify(serializedUser));
};

export const deserializeUser = async (userData, done) => {
  try {
    log('deserialize');
    // const user = await User.findById(id).exec();
    const userObject = JSON.parse(userData);
    // log(userObject);
    done(null, userObject);
  } catch (e) {
    logger.error(e.message);
    done(e);
  }
};

export const updateUserProfile = async (accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  const { _raw, ...user } = profile;
  try {
    // const user = await User.findOrCreateSocial(profile);
    const token = await new Promise((resolve, reject) =>
      jwt.sign(user, COOKIE_KEY, (err, jwt) => (err) ? reject(err) : resolve(jwt)));

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
