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
import { Tweet, User } from "../db/database.js";
const Sequelize = SQ.Sequelize;
const INCLUDE_USER = {
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
const ORDER_DESC = { order: [["createdAt", "DESC"]] };
export function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        return Tweet.findAll(Object.assign(Object.assign({}, INCLUDE_USER), ORDER_DESC));
    });
}
export function getAllByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return Tweet.findAll(Object.assign(Object.assign(Object.assign({}, INCLUDE_USER), ORDER_DESC), { include: Object.assign(Object.assign({}, INCLUDE_USER.include), { where: { username } }) }));
    });
}
export function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return Tweet.findOne(Object.assign({ where: { id } }, INCLUDE_USER));
    });
}
export function create(text, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return Tweet.create({ text, userId }).then((data) => getById(data.dataValues.id));
    });
}
export function update(id, text) {
    return __awaiter(this, void 0, void 0, function* () {
        return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
            tweet.text = text;
            return tweet.save();
        });
    });
}
export function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return Tweet.findByPk(id).then((tweet) => {
            tweet.destroy();
        });
    });
}
//# sourceMappingURL=tweet.js.map