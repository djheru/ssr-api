import passport from 'passport';
// import PassportGoogle from 'passport-google-oauth20';
import PassportJWT from 'passport-jwt';
import mongoose from 'mongoose';
import logger from '../utils/logger';

const { API_HOST, COOKIE_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const log = logger.log('app:services:auth');
const User = mongoose.model('User');
// const GoogleStrategy = PassportGoogle.Strategy;
const JWTStrategy = PassportJWT.Strategy;
const ExtractJWT = PassportJWT.ExtractJwt;
import refresh, { checkTokenValidity } from 'google-refresh-token';
import axios from 'axios';

export const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: COOKIE_KEY
};

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

/*const googleConfig = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  options: googlePermissionOptions,
  proxy: true
};*/

/*const serializeUser = (user, done) => {
  done(null, user.id);
};*/

/*export const deserializeUser = async (id, done) => {
  try {
    log(`ID: ${id}`);
    const user = await User.findOne(id).exec();
    done(null, user);
  } catch (e) {
    logger.error(e.message);
    done(e);
  }
};*/

/*export const updateGoogleProfile = async (accessToken, refreshToken, profile, done) => {
  log('Updating user profile');
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  await updateUserProfile(profile, done);
};*/

export const updateUserProfile = async (userData, done) => {
  try {
    log('updateUserProfile');
    const tokenIsValid = await validateToken(userData.accessToken);
    if (!tokenIsValid) {
      const newToken = await reauthenticate(userData.refreshToken);
      log('New token created');
      userData.accessToken = newToken;
    }
    const user = await User.findOrCreateSocial(userData);
    done(null, user);
  } catch (e) {
    logger.error(e.message);
    done(e);
  }
};

export const validateToken = async (accessToken) => {
  log('Validating Token');
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: { alt: 'json ' },
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return !!response;
  } catch (e) {
    logger.error(e);
    return false;
  }
};

export const reauthenticate = async (refreshToken) => {
  log('Refresh Token: ', refreshToken);

  return new Promise((resolve, reject) => {
    refresh(refreshToken, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, (err, json, res) => {
      if (err) {
        log('Error getting refresh token');
        return reject(err);
      }
      if (json.error) {
        const msg = `${res.statusCode}: ${json.error}`;
        log(msg);
        return reject(new Error(msg));
      }
      const newAccessToken = json.accessToken;
      if (!newAccessToken) {
        const msg = `${res.statusCode}: refreshToken error`;
        log(msg);
        return reject(new Error(msg));
      }
      return resolve(newAccessToken);
    });
  });
};

// const authStrategy = new GoogleStrategy(googleConfig, updateGoogleProfile);
const jwtStrategy = new JWTStrategy(jwtOptions, updateUserProfile);

/**
 * Add the auth middleware
 * @param app - Express app
 */
export function initializeAuth(app) {
  // passport.serializeUser(serializeUser);
  // passport.deserializeUser(deserializeUser);
  // passport.use(authStrategy);
  passport.use(jwtStrategy);
  // app.use(passport.initialize());
  // app.use(passport.session());
}
