import CommentDataHandler from "../__dwitter__.d.ts/data/comments";
import TweetDataHandler from "../__dwitter__.d.ts/data/tweet";
import UserDataHandler from "../__dwitter__.d.ts/data/user";
import KindOfRepository, {
  GoodDBMethod,
} from "../__dwitter__.d.ts/exception/data";

const throwErrorOfRepository = (error: Error | unknown) => {
  const throwError = (title: KindOfRepository, method: string) => {
    throw `${title}.${method} ##\n ${error}`;
  };

  return {
    user: (method: keyof UserDataHandler) =>
      throwError("userRepository", method),
    tweet: (method: keyof TweetDataHandler) =>
      throwError("tweetRepository", method),
    comment: (method: keyof CommentDataHandler) =>
      throwError("commentRepository", method),
    good: {
      tweet: (method: GoodDBMethod) =>
        throwError("goodRepository", `${method} of tweet`),
      comment: (method: GoodDBMethod) =>
        throwError("goodRepository", `${method} of comment`),
    },
  };
};

export default throwErrorOfRepository;
