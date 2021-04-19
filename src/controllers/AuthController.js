const { json } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  async login(req, res) {
    const mailTestMask = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    const { email, password } = req.body;

    const mailTest = mailTestMask.test(String(email).toLowerCase());

    if (!email || mailTest === false) {
      return res.json({
        error: { msg: "Invalid value for E-mail", input: "email" },
      });
    }
    if (!password || password.length < 8) {
      return res.json({
        error: {
          msg: "Password is required 8 or mor characters",
          input: "password",
        },
      });
    }

    let user = await User.findOne({ email });

    if (!user)
      return res.json({ error: { msg: "User not found", input: "email" } });

    const payload = {
      name: user.name,
      id: user.id,
      email: user.email,
      phone: user.phone,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 31557600000,
    });

    return res.json(payload);
  },

  async googleAuth(accessToken, refreshToken, profile, done) {
    const name = profile._json.name;
    const email = profile._json.email;
    const pictures = profile._json.picture;

    let user = await User.findOne({ email: email });
    console.log(user);

    if (!user) {
      let userSchema = {
        name,
        email,
      };

      user = await new User(userSchema).save();
    }

    const payload = {
      name: user.name,
      id: user.id,
      email: user.email,
      phone: user.phone,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 31557600000,
    });

    return done(null, token);
  },
};
