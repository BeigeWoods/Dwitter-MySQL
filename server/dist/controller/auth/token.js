var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
export function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresInSec,
    });
}
export function setToken(res, token) {
    const options = {
        maxAge: config.jwt.expiresInSec * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };
    res.cookie("token", token, options);
}
export function csrfToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const csrfToken = yield generateCSRFToken();
        res.status(200).json({ csrfToken });
    });
}
function generateCSRFToken() {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.hash(config.csrf.plainToken, 1);
    });
}
//# sourceMappingURL=token.js.map