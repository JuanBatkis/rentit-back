const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  (email, password, done) => {
    User.findOne({ email })
    .then(foundUser => {
      if (!foundUser) {
        done(null, false, { message: 'Incorrect email' });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        done(null, false, { message: 'Incorrect password' });
        return;
      }

      done(null, foundUser);
    })
    .catch(err => done(err));
  }
));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK
    },
    async (_, __, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Google account details:", profile);

      const user = await User.findOne({googleID: profile.id})
      if (user) {
        return done(null, user)
      }

      const sameEmail = await User.findOne({email: profile.emails[0].value})
      if (sameEmail) {
        const user = await User.findByIdAndUpdate(
          sameEmail._id,
          { $set: { googleID: profile.id } },
          { new: true }
        )
        return done(null, user)
      }

      const newUser = await User.create({
        googleID: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0].value,
        verified: true
      })

      return done(null, newUser)
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['id', 'email', 'photos', 'name']
    },
    async (_, __, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Facebook account details:", profile);

      const user = await User.findOne({facebookID: profile.id})
      if (user) {
        return done(null, user)
      }

      const sameEmail = await User.findOne({email: profile.emails[0].value})
      if (sameEmail) {
        const user = await User.findByIdAndUpdate(
          sameEmail._id,
          { $set: { facebookID: profile.id } },
          { new: true }
        )
        return done(null, user)
      }

      const newUser = await User.create({
        facebookID: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0].value,
        verified: true
      })

      return done(null, newUser)
    }
  )
);