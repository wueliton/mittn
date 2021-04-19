const { query } = require("express");
const express = require("express");
const passport = require("passport");
const AuthController = require("./controllers/AuthController");
const routes = express.Router();

routes.get("/", (req, res) => {
  res.send("Hello World");
});

routes.post("/login", AuthController.login);

routes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

routes.get("/auth/google/callback", (req, res) => {
  passport.authenticate("google", function (err, token) {
    if (err) {
      return res.status(401).json(err);
    }
    if (token) {
      return res.status(200).json({ token });
    }
  })(req, res);
});

module.exports = routes;
