const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");

const mailTestMask =
  /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

module.exports = {
  async signIn(req, res) {
    const { email, password } = req.body;
    console.log(email, password);

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
      _id: user._id,
      email: user.email,
      phone: user.phone,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 31557600000,
    });

    return res.json(token);
  },

  async signUp(req, res) {
    const {
      name,
      email,
      password,
      phone,
      gender,
      bornDate,
      interests,
      city,
      uf,
      country,
      geolocation,
    } = req.body;
    const { latitude, longitude } = geolocation;

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

    let findUser = await User.findOne({ email });
    if (findUser)
      return res.json({
        error: {
          msg: findUser.googleAccount
            ? "User have account with Google Account"
            : "E-mail allready exists",
          input: "email",
        },
      });

    if (!name) return res.status(422).send({ msg: "Name is required" });
    if (!phone || phone.length < 10 || phone.length < 11)
      return res.status(422).send({ msg: "Phone is required" });
    if (!gender) return res.status(422).send({ msg: "Gender is required" });
    if (!bornDate)
      return res.status(422).send({ msg: "Born Date is required" });
    if (!interests)
      return res.status(422).send({ msg: "Interests is required" });
    if (!city) return res.status(422).send({ msg: "City is required" });
    if (!uf) return res.status(422).send({ msg: "UF is required" });
    if (!country) return res.status(422).send({ msg: "Country is required" });
    if (!geolocation)
      return res.status(422).send({ msg: "Geolocattion is required" });
    if (!latitude) return res.status(422).send({ msg: "Latitude is required" });
    if (!longitude)
      return res.status(422).send({ msg: "Longitude is required" });

    userData = {
      name,
      email,
      password,
      phone,
      gender,
      interests,
      city,
      uf,
      country,
      geolocation,
      googleAccount: false,
    };

    const user = await new User(userData).save();

    const payload = {
      name: user.name,
      _id: user._id,
      email: user.email,
      phone: user.phone,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 31557600000,
    });

    return res.status(200).send(token);
  },

  async googleAuth(accessToken, refreshToken, profile, done) {
    const name = profile._json.name;
    const email = profile._json.email;
    const pictures = profile._json.picture;

    let user = await User.findOne({ email: email });

    if (!user) {
      return done({
        msg: "User not found",
      });
    }

    const payload = {
      name: user.name,
      _id: user._id,
      email: user.email,
      phone: user.phone,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 31557600000,
    });

    return done(null, token);
  },

  async googleSignup(accessToken, refreshToken, profile, done) {
    const name = profile._json.name;
    const email = profile._json.email;
    const pictures = profile._json.picture;

    let user = await User.findOne({ email: email });

    if (user) {
      return done({
        msg: "User allready exists",
      });
    }

    const userSchema = {
      name,
      email,
      googleAccount: true,
    };

    user = await new User(userSchema).save();

    const payload = {
      name: user.name,
      _id: user._id,
      email: user.email,
      phone: user.phone,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 31557600000,
    });

    return done(null, token);
  },

  googleAuthCallback(req, res) {
    passport.authenticate("google-login", function (err, token) {
      if (err) res.status(401).json(err);
      if (token) res.status(200).json({ token });
    })(req, res);
  },

  googleSignupCallback(req, res) {
    passport.authenticate("google-signup", function (err, token) {
      if (err) res.status(401).json(err);
      if (token) res.status(200).json({ token });
    })(req, res);
  },
};
