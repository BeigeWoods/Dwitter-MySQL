export type KindOfController =
  | "authController"
  | "oauthController"
  | "tweetController"
  | "commentController"
  | "goodController";

type AboutUserCont = "signup" | "login";
type Bcrypt = "bcrypt.hash" | "bcrypt.compare";

type AuthContMethod =
  | AboutUserCont
  | "updateUser"
  | "updatePassword"
  | "withdrawal";
type AuthContSubtitle = Bcrypt | "isDuplicateEmailOrUsername";
type AuthCont = [AuthContMethod, AuthContSubtitle];

type OAuthContMethod = "githubStart" | "githubFinish";
type OAuthContSubtitle = Bcrypt | AboutUserCont | "getUser" | "getToken";
type OAuthCont = [OAuthContMethod, OAuthContSubtitle];

type ContentContCRUD = "getAll" | "create" | "update" | "delete";

type TweetContMethod = ContentContCRUD | "getById";
type GoodContentCont = "tweet" | "comment";

export type objectToHandleExceptionOfCont = {
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
    option: TweetContMethod,
    exception: Error | string,
    fromOwn?: boolean
  ) => never;
  comment: (
    option: ContentContCRUD,
    exception: Error | string,
    fromOwn?: boolean
  ) => never;
  good: (
    option: GoodContentCont,
    exception: Error | string,
    fromOwn?: boolean
  ) => never;
};
