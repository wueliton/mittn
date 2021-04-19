const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");
const AuthController = require("../controllers/AuthController");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      AuthController.googleAuth(accessToken, refreshToken, profile, done);
    }
  )
);
