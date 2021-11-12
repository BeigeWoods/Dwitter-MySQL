var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as tweetRepository from "../data/tweet.js";
import { getSocketIO } from "../connection/socket.js";
export function getTweets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.query.username;
        const data = yield (username
            ? tweetRepository.getAllByUsername(username)
            : tweetRepository.getAll());
        res.status(200).json(data);
    });
}
export function getTweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const tweet = yield tweetRepository.getById(id);
        if (tweet) {
            res.status(200).json(tweet);
        }
        else {
            res.status(404).json({ message: `Tweet id(${id}) not found` });
        }
    });
}
export function createTweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { text } = req.body;
        const tweet = yield tweetRepository.create(text, req.userId);
        res.status(201).json(tweet);
        getSocketIO().emit("tweets", tweet);
    });
}
export function updateTweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const text = req.body.text;
        const tweet = yield tweetRepository.getById(id);
        if (!tweet) {
            return res.status(404).json({ message: `Tweet not found: ${id}` });
        }
        if (tweet.userId !== req.userId) {
            return res.sendStatus(403);
        }
        const updated = yield tweetRepository.update(id, text);
        res.status(200).json(updated);
    });
}
export function deleteTweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const tweet = yield tweetRepository.getById(id);
        if (!tweet) {
            return res.status(404).json({ message: `Tweet not found: ${id}` });
        }
        if (tweet.userId !== req.userId) {
            return res.sendStatus(403);
        }
        yield tweetRepository.remove(id);
        res.sendStatus(204);
    });
}
//# sourceMappingURL=tweet.js.map