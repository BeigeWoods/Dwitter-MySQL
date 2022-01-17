var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class TweetController {
    constructor(tweetRepository, socketIO) {
        this.tweetRepository = tweetRepository;
        this.socketIO = socketIO;
        this.getTweets = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.query.username;
            const data = yield (username
                ? this.tweetRepository.getAllByUsername(username)
                : this.tweetRepository.getAll());
            res.status(200).json(data);
        });
        this.getTweet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tweet = yield this.tweetRepository.getById(id);
            if (tweet) {
                res.status(200).json(tweet);
            }
            else {
                res.status(404).json({ message: `Tweet id(${id}) not found` });
            }
        });
        this.createTweet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const text = req.body.text;
            const tweet = yield this.tweetRepository.create(text, req.userId);
            res.status(201).json(tweet);
            this.socketIO.emit("tweets", tweet);
        });
        this.updateTweet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const text = req.body.text;
            const tweet = yield this.tweetRepository.getById(id);
            if (!tweet) {
                return res.status(404).json({ message: `Tweet not found: ${id}` });
            }
            if (tweet.userId !== req.userId) {
                return res.sendStatus(403);
            }
            const updated = yield this.tweetRepository.update(id, text);
            res.status(200).json(updated);
        });
        this.deleteTweet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const tweet = yield this.tweetRepository.getById(id);
            if (!tweet) {
                return res.status(404).json({ message: `Tweet not found: ${id}` });
            }
            if (tweet.userId !== req.userId) {
                return res.sendStatus(403);
            }
            yield this.tweetRepository.remove(id);
            res.sendStatus(204);
        });
    }
}
//# sourceMappingURL=tweet.js.map