const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../utils/config");
const { User, Session } = require("../models");


router.post("/", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  const passwordCorrect = req.body.password === "salainen";
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
  const userToken = {
    username: user.username,
    id: user.id,
  };
  const token = jwt.sign(userToken, SECRET);
  await Session.create({ token, userId: user.id });
  res.send({
    token,
    username: user.username,
    name: user.name,
    id: user.id
  });
});

module.exports = router;
