import SQ from "sequelize";
import { Tweet, User, UserModel } from "../db/database.js";

const Sequelize = SQ.Sequelize;

interface IncludeUser {
  attributes: Array<any>;
  include: {
    model: SQ.ModelCtor<UserModel>;
    attributes: any[];
  };
}

interface OrderDesc {
  order: Array<any>;
}

const INCLUDE_USER: IncludeUser = {
  attributes: [
    "id",
    "text",
    "createdAt",
    "userId",
    [Sequelize.col("user.name"), "name"],
    [Sequelize.col("user.username"), "username"],
    [Sequelize.col("user.url"), "url"],
  ],
  include: {
    model: User,
    attributes: [],
  },
};

const ORDER_DESC: OrderDesc = { order: [["createdAt", "DESC"]] };

export async function getAll() {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

export async function getAllByUsername(username: string) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });
}

export async function getById(id: string) {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

export async function create(text: string, userId: number) {
  return Tweet.create({ text, userId }).then((data) =>
    getById(data.dataValues.id)
  );
}

export async function update(id: string, text: string) {
  return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
    tweet.text = text;
    return tweet.save();
  });
}

export async function remove(id: string) {
  return Tweet.findByPk(id).then((tweet) => {
    tweet.destroy();
  });
}
