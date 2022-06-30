const router = require("express").Router();
const { Blog, User } = require("../models");
const { Op } = require("sequelize");
const tokenExtractor = require("../utils/token-extractor");

const findBlog = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.substring]: `%${req.query.search}%` } },
      ],
    };
  }
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ["userId"],
    },
    include: {
      model: User,
      attributes: ["name", "id"],
    },
    order: [["likes", "DESC"]],
    where,
  });

  res.json(blogs);
});

router.get("/:id", findBlog, async (req, res) => {
  if (req.blog) {
    return res.json(req.blog);
  }
  return res.status(404).end();
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.token.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  // user required for the part5 frontend
  return res.json({ ...blog.toJSON(), user });
});

router.delete("/:id", tokenExtractor, findBlog, async (req, res) => {
  if (req.blog) {
    if (req.blog.userId !== req.token.id) {
      return res.status(401).end();
    }
    await req.blog.destroy();
    return res.json(req.blog);
  }
  return res.status(404).end();
});

router.put("/:id", findBlog, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    // user required for the part5 frontend
    const user = await req.blog.getUser();
    return res.json({ ...req.blog.toJSON(), user });
  }
  return res.status(404).end();
});

module.exports = router;
