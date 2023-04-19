export interface GoodDataHandler {
  clickTweet(userId: number, tweetId: string): Promise<void>;
  unClickTweet(userId: number, tweetId: string): Promise<void>;
}

export declare class GoodRepository implements GoodDataHandler {
  constructor();
  clickTweet: (userId: number, tweetId: string) => Promise<void>;
  unClickTweet: (userId: number, tweetId: string) => Promise<void>;
}
