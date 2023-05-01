declare type CommentData = {
  id: string;
  text: string;
  good: number;
  tweetId: string;
  userId: number;
  repliedId?: string;
  createdAt: object;
  updatedAt: object;
};

export interface CommentDataHandler {
  getAll(
    tweetId: string,
    userId: number
  ): Promise<CommentData[] | void | never>;
  getById(
    tweetId: string,
    mainId: string,
    userId: number
  ): Promise<CommentData | void | never>;
  create(
    userId: number,
    tweetId: string,
    text: string,
    repliedUser?: string
  ): Promise<CommentData | void | never>;
  createReply(mainId: string, username: string): Promise<void | never>;
  update(
    tweetId: string,
    mainId: string,
    userId: number,
    text: string
  ): Promise<CommentData | void | never>;
  updateGood(id: string, good: number): Promise<void | never>;
  remove(mainId: string): Promise<void | never>;
}
export declare class CommentRepository implements CommentDataHandler {
  private readonly Select_Feild;
  private readonly With_User;
  private readonly With_Good;
  private readonly Order_By;
  constructor();
  getAll: (
    tweetId: string,
    userId: number
  ) => Promise<CommentData[] | void | never>;
  getById: (
    tweetId: string,
    mainId: string,
    userId: number
  ) => Promise<CommentData | void | never>;
  create: (
    userId: number,
    tweetId: string,
    text: string,
    repliedUser?: string
  ) => Promise<CommentData | void | never>;
  createReply: (mainId: string, username: string) => Promise<void | never>;
  update: (
    tweetId: string,
    mainId: string,
    userId: number,
    text: string
  ) => Promise<CommentData | void | never>;
  updateGood(id: string, good: number): Promise<void | never>;
  remove: (mainId: string) => Promise<void | never>;
}
