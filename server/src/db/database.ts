import SQ from "sequelize";
import { config } from "../config.js";
import { TweetModel, UserModel } from "../__dwitter__.d.ts/db/database.js";

const { database, user, password, host } = config.db;
const { DataTypes } = SQ;

export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: "mysql",
  logging: false, //database 테이블 정보 출력
});

export const User = sequelize.define<UserModel>(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(45),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      unique: true,
      allowNull: false,
    },
    socialLogin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    url: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    indexes: [
      { unique: true, fields: ["username"] },
      { unique: true, fields: ["email"] },
    ],
  }
);

export const Tweet = sequelize.define<TweetModel>(
  "tweet",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    video: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  }
);

Tweet.belongsTo(User, {
  onDelete: "cascade",
});
