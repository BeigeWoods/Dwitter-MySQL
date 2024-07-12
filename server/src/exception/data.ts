import {
  CommentRepMethod,
  GoodDBMethod,
  KindOfRepository,
  TweetRepMethod,
  UserRepMethod,
} from "../__dwitter__.d.ts/exception/data";

const throwErrorOfRepository = (error: Error | unknown) => {
  const throwError = (title: KindOfRepository, method: string) => {
    throw `${title}.${method} ##\n ${error}`;
  };

  return {
    user: (method: UserRepMethod) => throwError("userRepository", method),
    tweet: (method: TweetRepMethod) => throwError("tweetRepository", method),
    comment: (method: CommentRepMethod) =>
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
