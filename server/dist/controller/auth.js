var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";
export function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, name, email, url } = req.body;
        const found = yield userRepository.findByUsername(username);
        if (found) {
            return res.status(409).json({ message: `${username} already exists` });
        }
        const hashed = yield bcrypt.hash(password, config.bcrypt.saltRounds);
        const userId = yield userRepository.createUser({
            username,
            password: hashed,
            name,
            email,
            url,
        });
        const token = createJwtToken(userId);
        setToken(res, token);
        res.status(201).json({ token, username });
    });
}
export function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        const user = yield userRepository.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: "Invalid user or password" });
        }
        const isValidPassword = yield bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid user or password" });
        }
        const token = createJwtToken(user.id);
        setToken(res, token);
        res.status(200).json({ token, username });
    });
}
export function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        setToken(res, "");
        res.sendStatus(204);
    });
}
function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresInSec,
    });
}
function setToken(res, token) {
    const options = {
        maxAge: config.jwt.expiresInSec * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };
    res.cookie("token", token, options);
}
export function me(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ token: req.token, username: user.username });
    });
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
//# sourceMappingURL=auth.js.map