export declare type OutputGood = { id: number; good: number };

declare type GoodDataHandler = {
  click(
    userId: number,
    contentId: string,
    isTweet: boolean
  ): Promise<OutputGood | void>;
  undo(
    userId: number,
    contentId: string,
    isTweet: boolean
  ): Promise<OutputGood | void>;
};

export default GoodDataHandler;
