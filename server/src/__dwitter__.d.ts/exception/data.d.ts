export type KindOfRepository =
  | "userRepository"
  | "tweetRepository"
  | "commentRepository"
  | "goodRepository";

type RepCUD = "create" | "update" | "delete";

export type UserRepMethod =
  | RepCUD
  | "findById"
  | "findByUsername"
  | "findByEmail"
  | "updatePassword";

type ContentRepRU = "getAll" | "getById" | "updateGood";

export type TweetRepMethod = RepCUD | ContentRepRU | "getAllByUsername";

export type CommentRepMethod = RepCUD | ContentRepRU | "createReply";

export type GoodDBMethod = "click" | "unClick";
