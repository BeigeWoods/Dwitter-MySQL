declare type KindOfRepository =
  | "userRepository"
  | "tweetRepository"
  | "commentRepository"
  | "goodRepository";

export type GoodDBMethod = "click" | "unClick";

export default KindOfRepository;
