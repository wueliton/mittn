const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  async userProfile(req, res) {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });

    if (!user) return res.status(404).send({ msg: "User not found" });
    return res.status(200).send(user);
  },
};
