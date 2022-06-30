const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../utils/config");
const { User, Session } = require("../models");
const tokenExtractor = require("../utils/token-extractor");

router.delete("/", tokenExtractor, async (req, res) => {
  await Session.destroy({
    where: {
      token: req.rawtoken,
    },
  });
  res.status(204).end();
});

module.exports = router;
