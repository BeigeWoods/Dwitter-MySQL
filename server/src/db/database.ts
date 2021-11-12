import SQ, { Model } from "sequelize";
import { config } from "../config.js";

const { database, user, password, host } = config.db;

const { DataTypes } = SQ;

export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: "mysql",
  logging: false, //database 테이블 정보 출력
});

export interface UserModel extends Model {
  readonly id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  url?: string;
  readonly dataValues?: any;
}

export interface TweetModel extends Model {
  readonly userId?: number;
  readonly id: number;
  text: string;
  readonly dataValues?: any;
}

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
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    url: DataTypes.TEXT,
  },
  { timestamps: false }
);

export const Tweet = sequelize.define<TweetModel>("tweet", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Tweet.belongsTo(User);
