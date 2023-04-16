import SQ from "sequelize";
import { TweetData, TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";
import { GoodModel, UserModel } from "../__dwitter__.d.ts/db/database";

export class TweetRepository implements TweetDataHandler<TweetData> {
  private readonly INCLUDE_USER: SQ.FindOptions = {
    attributes: [
      "id",
      "text",
      "video",
      "image",
      "createdAt",
      "good",
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
  private readonly INCLUDE_GOOD: SQ.FindOptions = {
    include: {
      model: this.goodTweet,
      through: {
        where: {
          userId: "userId",
        },
      },
    },
  };

  constructor(
    private tweet: SQ.ModelStatic<TweetData>,
    private user: SQ.ModelStatic<UserModel>,
    private goodTweet: SQ.ModelStatic<GoodModel>
  ) {}

  getAll = async () => {
    return await this.tweet
      .findAll({
        ...this.INCLUDE_USER,
        ...this.ORDER_DESC,
      })
      .catch((err) => {
        throw Error(err);
      });
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
      .catch((err) => {
        throw Error(err);
      });
  };

  getById = async (id: string) => {
    return await this.tweet
      .findOne({
        where: { id },
        ...this.INCLUDE_USER,
        ...this.INCLUDE_GOOD,
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  create = async (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => {
    return await this.tweet
      .create({ text, video, image, userId, good: 0 })
      .then((data) => this.getById(data.dataValues.id!))
      .catch((err) => {
        throw Error(err);
      });
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
      .catch((err) => {
        throw Error(err);
      });
  };

  remove = async (id: string) => {
    return await this.tweet
      .findByPk(id)
      .then(async (tweet) => {
        await tweet!.destroy();
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  updateGood = async (id: string, good: number) => {
    return await this.tweet
      .findByPk(id)
      .then(async (tweet) => {
        tweet!.good = good;
        return await tweet!.save();
      })
      .catch((err) => {
        throw Error(err);
      });
  };
}
