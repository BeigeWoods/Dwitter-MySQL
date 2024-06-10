export declare interface GoodDataHandler {
  clickTweet(userId: number, tweetId: string): Promise<never | void>;
  unClickTweet(userId: number, tweetId: string): Promise<never | void>;
  clickComment(userId: number, commentId: string): Promise<never | void>;
  unClickComment(userId: number, commentId: string): Promise<never | void>;
}

export declare class GoodRepository implements GoodDataHandler {
  constructor();

  clickTweet: (userId: number, tweetId: string) => Promise<never | void>;
  unClickTweet: (userId: number, tweetId: string) => Promise<never | void>;
  clickComment: (userId: number, commentId: string) => Promise<never | void>;
  unClickComment: (userId: number, commentId: string) => Promise<never | void>;
}
