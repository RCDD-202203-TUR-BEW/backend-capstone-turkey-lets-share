const passport = require('passport');
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const USER = await User.findById(id);
  done(null, USER);
});

// passport.use();
