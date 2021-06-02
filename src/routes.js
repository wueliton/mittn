const { query, Router } = require("express");
const express = require("express");
const passport = require("passport");
const routes = express.Router();
const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");
const ValidateToken = require("./middleware/tokenValidate");

routes.get("/", (req, res) => {
  res.send("Hello World");
});

routes.post("/login", AuthController.signIn);

routes.post("/signup", AuthController.signUp);

routes.get(
  "/login/google",
  passport.authenticate("google-login", { scope: ["profile", "email"] })
);

routes.get("/login/google/callback", AuthController.googleAuthCallback);

routes.get(
  "/signup/google",
  passport.authenticate("google-signup", { scope: ["profile", "email"] })
);

routes.get("/signup/google/callback", AuthController.googleSignupCallback);

routes.get("/profile/:id", ValidateToken, UserController.userProfile);

module.exports = routes;
