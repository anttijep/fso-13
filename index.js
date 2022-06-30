const express = require("express");
require("express-async-errors");
const app = express();
const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const authorsRouter = require("./controllers/authors");
const readingsRouter = require("./controllers/reading-lists");
const errorHandler = require("./utils/error-handler");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglists", readingsRouter);
app.use(errorHandler);

(async () => {
  if (await connectToDatabase()) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
})();
