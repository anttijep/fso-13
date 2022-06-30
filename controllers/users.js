const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const where = {};
  if (req.query.read) {
    if (req.query.read !== "true" && req.query.read !== "false") {
      return res.status(400).json({
        error: `invalid query option: 'read' was ${req.query.read}, expected either 'true' or 'false'`,
      });
    }
    where.isRead = req.query.read === "true";
  }
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
      },
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
        through: {
          attributes: ["id", "isRead"],
          where,
        },
      },
    ],
  });
  if (user) {
    return res.json(user);
  }
  res.status(404).end();
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.hasOwnProperty("disabled")) {
      user.disabled = req.body.disabled;
    }
    await user.save();
    return res.json(user);
  }
  res.status(404).end();
});

module.exports = router;
