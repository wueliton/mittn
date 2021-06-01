const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");
const AuthController = require("../controllers/AuthController");
require("dotenv").config();

passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BASE_URL + "login/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      AuthController.googleAuth(accessToken, refreshToken, profile, done);
    }
  )
);

passport.use(
  "google-signup",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BASE_URL + "signup/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      AuthController.googleSignup(accessToken, refreshToken, profile, done);
    }
  )
);
