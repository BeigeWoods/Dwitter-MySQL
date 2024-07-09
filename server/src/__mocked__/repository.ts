import { UserDataHandler } from "../__dwitter__.d.ts/data/user";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";
import GoodDataHandler from "../__dwitter__.d.ts/data/good";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";

export const mockedUserRepository: jest.Mocked<UserDataHandler> = {
  findById: jest.fn(),
  findByUsername: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  updatePassword: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

export const mockedTweetRepository: jest.Mocked<TweetDataHandler> = {
  getAll: jest.fn(),
  getAllByUsername: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateGood: jest.fn(),
  delete: jest.fn(),
};

export const mockedCommentRepository: jest.Mocked<CommentDataHandler> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  createReply: jest.fn(),
  update: jest.fn(),
  updateGood: jest.fn(),
  delete: jest.fn(),
};

export const mockedGoodRepository: jest.Mocked<GoodDataHandler> = {
  tweet: {
    click: jest.fn(),
    unClick: jest.fn(),
  },
  comment: {
    click: jest.fn(),
    unClick: jest.fn(),
  },
};
