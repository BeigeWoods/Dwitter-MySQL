export declare interface GoodDataHandler {
  clickTweet(userId: number, tweetId: string): Promise<Error | void>;
  unClickTweet(userId: number, tweetId: string): Promise<Error | void>;
  clickComment(userId: number, commentId: string): Promise<Error | void>;
  unClickComment(userId: number, commentId: string): Promise<Error | void>;
}

export declare class GoodRepository implements GoodDataHandler {
  constructor();

  clickTweet: (userId: number, tweetId: string) => Promise<Error | void>;
  unClickTweet: (userId: number, tweetId: string) => Promise<Error | void>;
  clickComment: (userId: number, commentId: string) => Promise<Error | void>;
  unClickComment: (userId: number, commentId: string) => Promise<Error | void>;
}
