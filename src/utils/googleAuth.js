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
      callbackURL: "http://localhost:3000/login/google/callback",
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
      callbackURL: "http://localhost:3000/signup/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      AuthController.googleSignup(accessToken, refreshToken, profile, done);
    }
  )
);
