// i'm using https://www.youtube.com/watch?v=Q0a0594tOrc as a tutorial and it's great

//had to change the name of this file from auth.js to auth.cjs, as suggested by the helpful errors in the terminal, because my package.json file think we're using modules which are imported as opposed to required, and rather than risk breaking things, i changed up the file extension


require('dotenv').config()

//now we can bury our secrets in process.env
const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    
      return done(null, profile);
    //   return done(err, profile);
    //we're not using a user database, so there's no database error this can return, so we're changing this "err" argument to null
    
  }
));

passport.serializeUser(function (user, done){
    done(null, user)
})

passport.deserializeUser(function (user, done){
    done(null, user)
})

