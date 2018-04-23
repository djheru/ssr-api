import passport from 'passport';
// import PassportGoogle from 'passport-google-oauth20';
import PassportJWT from 'passport-jwt';
import mongoose from 'mongoose';
import logger from '../utils/logger';

const { API_HOST, COOKIE_KEY/*, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET*/ } = process.env;
const log = logger.log('app:server');
const User = mongoose.model('User');
// const GoogleStrategy = PassportGoogle.Strategy;
const JWTStrategy = PassportJWT.Strategy;
const ExtractJWT = PassportJWT.ExtractJwt;

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
    log('user data');
    log(userData);
    const user = await User.findOrCreateSocial(userData);
    done(null, user);
  } catch (e) {
    logger.error(e.message);
    done(e);
  }
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
