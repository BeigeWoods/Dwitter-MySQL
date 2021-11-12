var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../db/database.js";
export function findByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findOne({ where: { username } });
    });
}
export function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findByPk(id);
    });
}
export function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, name, email, url } = user;
        const userData = yield User.create({
            username,
            password,
            name,
            email,
            url,
        });
        return userData.dataValues.id;
    });
}
//# sourceMappingURL=auth.js.map