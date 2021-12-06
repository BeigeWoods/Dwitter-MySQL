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
import * as userRepository from "../../data/auth.js";
import { config } from "../../config.js";
import * as tokenController from "./token.js";
export function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, name, email, url } = req.body;
        const foundEmail = yield userRepository.findByUserEmail(email);
        if (foundEmail) {
            return res.status(409).json({ message: `${email} already exists.` });
        }
        const foundUsername = yield userRepository.findByUsername(username);
        if (foundUsername) {
            return res.status(409).json({ message: `${username} already exists` });
        }
        const hashed = yield bcrypt.hash(password, config.bcrypt.saltRounds);
        const userId = yield userRepository.createUser({
            username,
            password: hashed,
            name,
            email,
            url,
            socialLogin: false,
        });
        const token = tokenController.createJwtToken(userId);
        tokenController.setToken(res, token);
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
        const token = tokenController.createJwtToken(user.id);
        tokenController.setToken(res, token);
        res.status(200).json({ token, username });
    });
}
export function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        tokenController.setToken(res, "");
        res.sendStatus(204);
    });
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
export function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.socialLogin) {
            res.sendStatus(204);
        }
        else {
            const { username, name, email, url } = user;
            return res.status(200).json({ username, name, email, url });
        }
    });
}
export function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, name, email, url } = req.body;
        const foundUsername = yield userRepository.findByUsername(username);
        if (foundUsername && foundUsername.id !== req.userId) {
            return res.status(409).json({ message: `${username} already exists` });
        }
        const foundEmail = yield userRepository.findByUserEmail(email);
        if (foundEmail && foundEmail.id !== req.userId) {
            return res.status(409).json({ message: `${email} already exists` });
        }
        yield userRepository.updateUser(req.userId, {
            username,
            name,
            email,
            url,
        });
        return res.status(201).json({ username, name, email, url });
    });
}
export function password(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { oldPassword, newPassword, checkPassword } = req.body;
        const user = yield userRepository.findById(req.userId);
        const isValidPassword = yield bcrypt.compare(oldPassword, user.password);
        if (user.socialLogin) {
            return res.sendStatus(404);
        }
        if (!isValidPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        if (newPassword !== checkPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        else {
            const hashedNew = yield bcrypt.hash(newPassword, config.bcrypt.saltRounds);
            yield userRepository.updatePassword(req.userId, hashedNew);
            return res.sendStatus(204);
        }
    });
}
export function withdrawal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield userRepository.deleteUser(req.userId);
        return res.sendStatus(204);
    });
}
//# sourceMappingURL=auth.js.map