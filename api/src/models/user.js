import mongoose from 'mongoose';
import moment from 'moment';
import logger from '../utils/logger';

const Schema = mongoose.Schema;
const log = logger.log('app:models:user');

const mapProfileToSchema = profile => ({
  name: profile.displayName,
  email: (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '',
  photo: (profile.photos && profile.photos.length > 0) ? profile.photos[0].value : '',
  gender: profile.gender,
  googleId: profile.id,
  accessToken: profile.accessToken,
  refreshToken: profile.refreshToken,
  lastLogin: moment()
});

const userSchema = new Schema({
  name: { type: String, required: false, select: true },
  email: { type: String, unique: true, select: true },
  photo: { type: String, select: true },
  gender: { type: String, select: true },
  googleId: { type: String, select: true },
  googleCalendarId: { type: String },
  accessToken: { type: String, required: false, select: false },
  refreshToken: { type: String, required: false, select: false },
  lastLogin: { type: Date },
  todos: { type: [{ type: Schema.Types.ObjectId, ref: 'Todo' }] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  id: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

userSchema.statics.findOrCreateSocial = async function findOrCreateSocial(userObject) {
  const User = mongoose.model('User');
  const userData = mapProfileToSchema(userObject);
  const email = userData.email;

  try {
    const user = await User.findOne({ email }, { accessToken: 1 });

  if (user) {
    Object.keys(userData).forEach((userField) => {
      user[userField] = userData[userField];
    });
  }
  const newOrExistingUser = (user) || new User(userData);
  const saved = await newOrExistingUser.save();
  return saved;
  } catch (e) {
    log(e.message);
  }
};

mongoose.model('User', userSchema);
