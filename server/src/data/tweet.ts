import SQ from "sequelize";
import { TweetModel, UserModel } from "../db/database.js";

export interface TweetDataHandler {
  getAll(): Promise<TweetModel[]>;
  getAllByUsername(username: string): Promise<TweetModel[]>;
  getById(id: string): Promise<TweetModel | null>;
  create(text: string, userId: number): Promise<TweetModel | null>;
  update(id: string, text: string): Promise<TweetModel>;
  remove(id: string): Promise<void>;
}

export class TweetRepository implements TweetDataHandler {
  private readonly INCLUDE_USER: SQ.FindOptions = {
    attributes: [
      "id",
      "text",
      "createdAt",
      "userId",
      [SQ.Sequelize.col("user.name"), "name"],
      [SQ.Sequelize.col("user.username"), "username"],
      [SQ.Sequelize.col("user.url"), "url"],
    ],
    include: {
      model: this.user,
      attributes: [],
    },
  };
  private readonly ORDER_DESC: SQ.FindOptions = {
    order: [["createdAt", "DESC"]],
  };

  constructor(
    private tweet: SQ.ModelCtor<TweetModel>,
    private user: SQ.ModelCtor<UserModel>
  ) {}

  getAll = async () => {
    return this.tweet.findAll({ ...this.INCLUDE_USER, ...this.ORDER_DESC });
  };

  getAllByUsername = async (username: string) => {
    return this.tweet.findAll({
      ...this.INCLUDE_USER,
      ...this.ORDER_DESC,
      include: {
        ...(this.INCLUDE_USER.include! as SQ.IncludeOptions),
        where: { username },
      },
    });
  };

  getById = async (id: string) => {
    return this.tweet.findOne({
      where: { id },
      ...this.INCLUDE_USER,
    });
  };

  create = async (text: string, userId: number) => {
    return this.tweet
      .create({ text, userId })
      .then((data) => this.getById(data.dataValues.id!));
  };

  update = async (id: string, text: string) => {
    return this.tweet.findByPk(id, this.INCLUDE_USER).then((tweet) => {
      tweet!.text = text;
      return tweet!.save();
    });
  };

  remove = async (id: string) => {
    return this.tweet.findByPk(id).then((tweet) => {
      tweet!.destroy();
    });
  };
}
