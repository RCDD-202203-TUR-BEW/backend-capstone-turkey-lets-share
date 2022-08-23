const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const { emailForRegistering } = require('../services/mail');
const { generateUniqeUsername } = require('../services/utils');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const USER = await User.findById(id);
  done(null, USER);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GAPP_CLIENT_ID,
      clientSecret: process.env.GAPP_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ providerId: `google-${profile.id}` });
        if (!user) {
          user = await User.create({
            email: profile.emails[0].value,
            username: generateUniqeUsername(profile.emails[0].value),
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePhoto: profile.photos[0].value,
            provider: 'Google',
            providerId: `google-${profile.id}`,
          });

          await emailForRegistering(
            user.firstName,
            user.lastName,
            user.username,
            user.email
          );
        }
        cb(null, user);
      } catch (err) {
        cb(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FAPP_CLIENT_ID,
      clientSecret: process.env.FAPP_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_REDIRECT_URI,
      profileFields: ['id', 'displayName', 'name', 'gender', 'photos', 'email'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ providerId: `facebook-${profile.id}` });
        if (!user) {
          user = await User.create({
            email: profile.emails[0].value,
            username: generateUniqeUsername(profile.emails[0].value),
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePhoto: profile.photos[0].value,
            provider: 'Facebook',
            providerId: `facebook-${profile.id}`,
          });

          await emailForRegistering(
            user.firstName,
            user.lastName,
            user.username,
            user.email
          );
        }
        cb(null, user);
      } catch (err) {
        cb(err, null);
      }
    }
  )
);

module.exports = {
  passport,
};
