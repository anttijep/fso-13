const Blog = require("./blog");
const User = require("./user");
const Session = require("./session");
const ReadingList = require("./reading-list");

User.hasMany(Blog);
Blog.belongsTo(User);
Session.belongsTo(User);
User.belongsToMany(Blog, {
  through: ReadingList,
  as: "readings",
});
Blog.belongsToMany(User, {
  through: ReadingList,
  as: "readUsers",
});

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
};
