const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const localStrategy = require("passport-local").Strategy
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET, auth } = require("../configs/index");

const FacebookTokenStrategy = require("passport-facebook-token");
const GooglePlusTokenStrategy = require('passport-google-plus-token');



const User = require('../models/User')
const bcrypt = require("bcryptjs")

//passport jwt
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET
}, async(payload, done) => {
    try {
        const user = await User.findById(payload.sub)
        if (!user) return done(null, false)
        done(null,user)
    } catch (error) {
        done(error,false)
    }
}))

//passport local
passport.use(new localStrategy({
    usernameField :'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);
        const isCorrectPassword = await user.isValidPassword(password);
        if (!isCorrectPassword) return done(null, false);
        done(null, user);
    } catch (error) {
        done(error,false)
    }
}))

//passport google
passport.use(new GooglePlusTokenStrategy({
    clientID: auth.google.CLIENT_ID,
    clientSecret: auth.google.CLIENT_SECRET,
}, async ( accessToken, refreshToken, profile , next) => {
     try {
       // check wherether this current user exist in the database
       const user = await User.findOne({
         authGoogleID: profile.id,
         authType: "google",
       });
        if (user) return next(null, user);
       //if new account
       const newUser = new User({
         authType: "google",
         email: profile.emails[0].value,
         authGoogleID: profile.id,
         firstName: profile.name.givenName,
         lastName: profile.name.familyName,
       });
         await newUser.save();
         next(null, newUser);
     } catch (error) {
       next(error, false);
     }
}))


//passport facebook
passport.use(new FacebookTokenStrategy({
    clientID: auth.facebook.CLIENT_ID,
    clientSecret: auth.facebook.CLIENT_SECRET,
    fbGraphVersion: 'v3.0'
  }, async function(accessToken, refreshToken, profile, done) {
       try {
       // check wherether this current user exist in the database
       const user = await User.findOne({
         authFacebookID: profile.id,
         authType: "facebook",
       });
        if (user) return done(null, user);
       //if new account
       const newUser = new User({
            authType: "facebook",
            email: profile.emails[0].value,
           authFacebookID: profile.id,
           firstName: profile.name.givenName,
           lastName: profile.name.familyName
       });
         await newUser.save();
         done(null, newUser);
     } catch (error) {
       done(error, false);
     }
  }
));