declare type CommentData = {
  id: string;
  text: string;
  good: number;
  createdAt: object;
  tweetId: string;
  userId: number;
};

export interface CommentDataHandler {
  getAll(tweetId: string): Promise<CommentData[] | void>;
  getById(tweetId: string, mainId: string): Promise<CommentData | void>;
  create(
    userId: number,
    tweetId: string,
    text?: string
  ): Promise<CommentData | void>;
  update(
    tweetId: string,
    mainId: string,
    text?: string
  ): Promise<CommentData | void>;
  remove(mainId: string): Promise<void>;
}
export declare class CommentRepository implements CommentDataHandler {
  private readonly Order_By;
  private readonly Select_From;
  constructor();
  getAll: (tweetId: string) => Promise<CommentData[] | void>;
  getById: (tweetId: string, mainId: string) => Promise<CommentData | void>;
  create: (
    userId: number,
    tweetId: string,
    text?: string
  ) => Promise<CommentData | void>;
  update: (
    tweetId: string,
    mainId: string,
    text?: string
  ) => Promise<CommentData | void>;
  remove: (mainId: string) => Promise<void>;
}
