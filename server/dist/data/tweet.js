var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import SQ from "sequelize";
export class TweetRepository {
    constructor(tweet, user) {
        this.tweet = tweet;
        this.user = user;
        this.INCLUDE_USER = {
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
        this.ORDER_DESC = {
            order: [["createdAt", "DESC"]],
        };
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            return this.tweet.findAll(Object.assign(Object.assign({}, this.INCLUDE_USER), this.ORDER_DESC));
        });
        this.getAllByUsername = (username) => __awaiter(this, void 0, void 0, function* () {
            return this.tweet.findAll(Object.assign(Object.assign(Object.assign({}, this.INCLUDE_USER), this.ORDER_DESC), { include: Object.assign(Object.assign({}, this.INCLUDE_USER.include), { where: { username } }) }));
        });
        this.getById = (id) => __awaiter(this, void 0, void 0, function* () {
            return this.tweet.findOne(Object.assign({ where: { id } }, this.INCLUDE_USER));
        });
        this.create = (text, userId) => __awaiter(this, void 0, void 0, function* () {
            return this.tweet
                .create({ text, userId })
                .then((data) => this.getById(data.dataValues.id));
        });
        this.update = (id, text) => __awaiter(this, void 0, void 0, function* () {
            return this.tweet.findByPk(id, this.INCLUDE_USER).then((tweet) => {
                tweet.text = text;
                return tweet.save();
            });
        });
        this.remove = (id) => __awaiter(this, void 0, void 0, function* () {
            return this.tweet.findByPk(id).then((tweet) => {
                tweet.destroy();
            });
        });
    }
}
//# sourceMappingURL=tweet.js.map