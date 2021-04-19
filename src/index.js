const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const routes = require("./routes");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

require("dotenv").config();
const server = http.Server(app);

mongoose.connect(process.env.BD, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(routes);

require("./utils/googleAuth");

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
