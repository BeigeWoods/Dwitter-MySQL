import {
  CommentRepMethod,
  GoodDBMethod,
  KindOfRepository,
  TweetRepMethod,
  UserRepMethod,
} from "../__dwitter__.d.ts/exception/data";

const repositoryExceptionHandler = (error: Error) => {
  const throwException = (title: KindOfRepository, method: string) => {
    throw `${title}.${method} ##\n ${error}`;
  };

  return {
    user: (method: UserRepMethod) => throwException("userRepository", method),
    tweet: (method: TweetRepMethod) =>
      throwException("tweetRepository", method),
    comment: (method: CommentRepMethod) =>
      throwException("commentRepository", method),
    good: {
      tweet: (method: GoodDBMethod) =>
        throwException("goodRepository", `${method} about tweet`),
      comment: (method: GoodDBMethod) =>
        throwException("goodRepository", `${method} about comment`),
    },
  };
};

export default repositoryExceptionHandler;
