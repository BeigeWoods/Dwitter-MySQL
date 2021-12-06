var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Tweet, User } from "../db/database.js";
export function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findByPk(id);
    });
}
export function findByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findOne({ where: { username } });
    });
}
export function findByUserEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findOne({ where: { email } });
    });
}
export function updateUser(id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, name, email, url } = user;
        return yield User.findByPk(id).then((data) => {
            data.set({ username, name, email, url });
            return data.save();
        });
    });
}
export function updatePassword(id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findByPk(id).then((pw) => {
            pw.password = password;
            return pw.save();
        });
    });
}
export function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, name, email, url, socialLogin } = user;
        const userData = yield User.create({
            username,
            password,
            name,
            email,
            url,
            socialLogin,
        });
        return userData.dataValues.id;
    });
}
export function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findByPk(id).then((user) => {
            user.destroy();
            Tweet.destroy({ where: { userId: id } });
        });
    });
}
//# sourceMappingURL=auth.js.map