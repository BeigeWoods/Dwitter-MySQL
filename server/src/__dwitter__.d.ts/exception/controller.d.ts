import AuthHandler from "../controller/auth/auth";
import GithubOauthHandler from "../controller/auth/oauth";
import CommentHandler from "../controller/comments";
import GoodHandler from "../controller/good";
import TweetDataHandler from "../data/tweet";

export type KindOfController =
  | "authController"
  | "oauthController"
  | "tweetController"
  | "commentController"
  | "goodController";

type Bcrypt = "bcrypt.hash" | "bcrypt.compare";

type AuthContMethod = keyof AuthHandler;
type AuthContSubtitle = Bcrypt | "isDuplicateEmailOrUsername";
type AuthCont = [AuthContMethod, AuthContSubtitle];

type OAuthContMethod = keyof GithubOauthHandler;
type OAuthContSubtitle = Bcrypt | "signup" | "login" | "getUser" | "getToken";
type OAuthCont = [OAuthContMethod, OAuthContSubtitle];

export type objectToThrowErrorOfCont = {
  auth: (
    option: AuthCont | AuthContMethod,
    exception: Error | string,
    fromOwn?: boolean
  ) => never;
  oauth: (
    option: OAuthCont | OAuthContMethod,
    exception: Error | string,
    fromOwn?: boolean
  ) => never;
  tweet: (
    option: keyof TweetDataHandler,
    exception: Error | string,
    fromOwn?: boolean
  ) => never;
  comment: (
    option: keyof CommentHandler,
    exception: Error | string,
    fromOwn?: boolean
  ) => never;
  good: (
    option: keyof GoodHandler,
    exception: Error | string,
    fromOwn?: boolean
  ) => never;
};

export type objectToPrintMessageOfCont = {
  oauth: (
    option: OAuthCont | OAuthContMethod,
    exception: Error | string,
    fromOwn?: boolean
  ) => string;
  good: (
    option: keyof GoodHandler,
    exception: Error | string,
    fromOwn?: boolean
  ) => string;
};
