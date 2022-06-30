const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");

const { Session, User } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);
    const decoded = jwt.verify(token, SECRET);
    const session = await Session.findOne({
      include: {
        model: User,
        attributes: ["disabled"],
      },
      where: {
        token,
      },
    });
    if (!session) {
      return res.status(401).json({ error: "invalid token" });
    }
    if (session.user.disabled) {
      return res.status(401).json({ error: "user disabled" });
    }
    req.token = decoded;
    req.rawtoken = token;
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};
module.exports = tokenExtractor;
