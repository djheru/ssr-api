import passport from 'passport';
import PassportGoogle from 'passport-google-oauth20';
import PassportJwt from 'passport-jwt';
import mongoose from 'mongoose';
import logger from '../utils/logger';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const log = logger.log('app:server');
const GoogleStrategy = PassportGoogle.Strategy;
const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;

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

export const SECRET = 'keboard cat says meow';

const googleConfig = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  options: googlePermissionOptions
};

const jwtConfig = {
  algorithms: ['HS256'],
  jwtFromRequest: (req) => ExtractJwt.fromAuthHeaderAsBearerToken()(req),
  secretOrKey: SECRET
};

const serializeUser = (user, done) => {
  done(null, user.id);
};

export const authenticateGoogle = () =>
  passport.authenticate('google', googlePermissionOptions);

export const authenticateJwt = () =>
  passport.authenticate('jwt', { session: false });

export const deserializeUser = async (id, done) => {
  try {
    const User = mongoose.model('User');
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
    const User = mongoose.model('User');
    const user = await User.findOrCreateSocial(profile);
    done(null, user);
  } catch (e) {
    logger.error(e.message);
    done(e);
  }
};

/**
 * Add the auth middleware
 * @param app - Express app
 */
export function initializeAuth(app) {
  const User = mongoose.model('User');
  const googleAuthStrategy = new GoogleStrategy(googleConfig, updateUserProfile);
  const jwtAuthStrategy = new JwtStrategy(jwtConfig, User.validateToken);

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(googleAuthStrategy);
  passport.use(jwtAuthStrategy);
  app.use(passport.initialize());
  app.use(passport.session());
}
