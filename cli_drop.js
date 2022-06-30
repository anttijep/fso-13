require("dotenv").config();

const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

(async () => {
  await sequelize.authenticate();
  await sequelize.query(
    "DROP TABLE IF EXISTS sessions, users, blogs, migrations, reading_lists;"
  );
  console.log(
    await sequelize.query(
      "select * from information_schema.tables where table_schema='public';"
    )
  );
  sequelize.close();
})();
