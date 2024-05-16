import { UserDataHandler } from "../__dwitter__.d.ts/data/user";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";
import { GoodDataHandler } from "../__dwitter__.d.ts/data/good";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";

export const mockedUserRepository: jest.Mocked<UserDataHandler> = {
  findById: jest.fn(),
  findByUsername: jest.fn(),
  findByUserEmail: jest.fn(),
  updateUser: jest.fn(),
  updatePassword: jest.fn(),
  createUser: jest.fn(),
  deleteUser: jest.fn(),
};

export const mockedTweetRepository: jest.Mocked<TweetDataHandler> = {
  getAll: jest.fn(),
  getAllByUsername: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateGood: jest.fn(),
  remove: jest.fn(),
};

export const mockedCommentRepository: jest.Mocked<CommentDataHandler> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  createReply: jest.fn(),
  update: jest.fn(),
  updateGood: jest.fn(),
  remove: jest.fn(),
};

export const mockedGoodRepository: jest.Mocked<GoodDataHandler> = {
  clickTweet: jest.fn(),
  unClickTweet: jest.fn(),
  clickComment: jest.fn(),
  unClickComment: jest.fn(),
};
