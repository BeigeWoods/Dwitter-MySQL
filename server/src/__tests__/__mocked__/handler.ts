import { MockResponse } from "node-mocks-http";
import UserDataHandler from "../../__dwitter__.d.ts/data/user";
import TweetDataHandler from "../../__dwitter__.d.ts/data/tweet";
import CommentDataHandler from "../../__dwitter__.d.ts/data/comments";
import GoodDataHandler from "../../__dwitter__.d.ts/data/good";
import TokenHandler from "../../__dwitter__.d.ts/controller/auth/token";

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
  delete: jest.fn(),
};

export const mockedCommentRepository: jest.Mocked<CommentDataHandler> = {
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockedGoodRepository: jest.Mocked<GoodDataHandler> = {
  click: jest.fn(),
  undo: jest.fn(),
};

export const mockedTokenController: jest.Mocked<TokenHandler> = {
  createJwtToken: jest.fn((userId: number) => "token"),
  setToken: jest.fn((res: MockResponse<any>, token) => res),
  csrfToken: jest.fn(),
};
