const { query } = require("express");
const express = require("express");
const passport = require("passport");
const AuthController = require("./controllers/AuthController");
const routes = express.Router();

routes.get("/", (req, res) => {
  res.send("Hello World");
});

routes.post("/login", AuthController.signIn);

routes.get(
  "/login/google",
  passport.authenticate("google-login", { scope: ["profile", "email"] })
);

routes.get("/login/google/callback", AuthController.googleAuthCallback);
routes.get("/signup/google/callback", AuthController.googleSignupCallback);

routes.get(
  "/signup/google",
  passport.authenticate("google-signup", { scope: ["profile", "email"] })
);

module.exports = routes;
