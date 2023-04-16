import SQ from "sequelize";
import { GoodModel } from "../__dwitter__.d.ts/db/database";
import { GoodDataHandler } from "../__dwitter__.d.ts/data/good";

export class GoodRepository implements GoodDataHandler {
  constructor(private goodTweet: SQ.ModelStatic<GoodModel>) {}

  clickTweet = async (userId: string, tweetId: string) => {
    return await this.goodTweet.create({ userId, tweetId }).catch((err) => {
      throw Error(err);
    });
  };

  unClickTweet = async (userId: string, tweetId: string) => {
    return await this.goodTweet
      .findOne({ where: { userId, tweetId } })
      .then(async (goodTweet) => {
        await goodTweet?.destroy();
      })
      .catch((err) => {
        throw Error(err);
      });
  };
}
