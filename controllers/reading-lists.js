const router = require("express").Router();
const { ReadingList } = require("../models");
const { sequelize } = require("../utils/db");
const tokenExtractor = require("../utils/token-extractor");

router.post("/", async (req, res) => {
  const readings = await ReadingList.create({
    blogId: req.body.blog_id,
    userId: req.body.user_id,
  });
  res.status(201).json(readings);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  if (req.body.read !== true) {
    throw Error("invalid or missing field 'read'");
  }
  const blogread = await ReadingList.findByPk(req.params.id);
  if (!blogread) {
    return res.status(404).end();
  }
  if (blogread.userId !== req.token.id) {
    return res.status(401).end();
  }
  blogread.isRead = req.body.read;
  await blogread.save();
  res.json(blogread);
});

module.exports = router;
