const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).send({ msg: "No token provided" });

  const parts = authorization.split(" ");
  if (!parts.length == 2) return res.status(401).send({ msg: "Invalid Token" });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ msg: "Token Malformated" });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ msg: "Invalid Token" });
    req.headers.user = decoded;
    return next();
  });
};
