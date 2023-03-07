import SQ from "sequelize";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";
import { TweetModel, UserModel } from "../__dwitter__.d.ts/db/database";

export class TweetRepository implements TweetDataHandler {
  private readonly INCLUDE_USER: SQ.FindOptions = {
    attributes: [
      "id",
      "text",
      "video",
      "image",
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
    return await this.tweet
      .findAll({ ...this.INCLUDE_USER, ...this.ORDER_DESC })
      .catch((err) => console.error(err));
  };

  getAllByUsername = async (username: string) => {
    return await this.tweet
      .findAll({
        ...this.INCLUDE_USER,
        ...this.ORDER_DESC,
        include: {
          ...(this.INCLUDE_USER.include! as SQ.IncludeOptions),
          where: { username },
        },
      })
      .catch((err) => console.error(err));
  };

  getById = async (id: string) => {
    return await this.tweet
      .findOne({
        where: { id },
        ...this.INCLUDE_USER,
      })
      .catch((err) => console.error(err));
  };

  create = async (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => {
    return await this.tweet
      .create({ text, video, image, userId })
      .then((data) => this.getById(data.dataValues.id!))
      .catch((err) => console.error(err));
  };

  update = async (
    id: string,
    text?: string,
    video?: string,
    image?: string
  ) => {
    return await this.tweet
      .findByPk(id, this.INCLUDE_USER)
      .then(async (tweet) => {
        tweet!.text = text;
        tweet!.video = video;
        tweet!.image = image;
        return await tweet!.save();
      })
      .catch((err) => console.error(err));
  };

  remove = async (id: string) => {
    return await this.tweet
      .findByPk(id)
      .then(async (tweet) => {
        await tweet!.destroy();
      })
      .catch((err) => console.error(err));
  };
}
