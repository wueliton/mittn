const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  password: String,
  phone: String,
  gender: String,
  bornDate: String,
  interests: String,
  city: String,
  uf: String,
  country: String,
  geolocation: {
    latitude: Number,
    longitude: Number,
  },
  likes: [
    {
      userId: String,
      date: Date,
    },
  ],
  unlikes: [
    {
      userId: String,
      date: Date,
    },
  ],
  googleAccount: Boolean,
  lastToken: String,
  disabled: Boolean,
});

module.exports = mongoose.model("User", UserSchema);
