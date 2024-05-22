import httpMocks from "node-mocks-http";
import { OutputUserInfo } from "../__dwitter__.d.ts/data/user";
import { TweetData } from "../__dwitter__.d.ts/data/tweet";

export const mockUser = (userId: number, username = ""): OutputUserInfo => ({
  userId,
  username,
  name: "",
  email: "",
  password: "",
  socialLogin: true,
});

export const mockTweet = {
  tweet: (text = "", video = "", image = ""): TweetData => ({
    username: "",
    name: "",
    url: "",
    tweetId: "",
    text,
    video,
    image,
    good: 1,
    createdAt: {},
    userId: 1,
  }),
  reqOptions: (
    tweetId?: number,
    text = "",
    video = "",
    image = "",
    oldImg = "",
    username = ""
  ): httpMocks.RequestOptions => ({
    user: { userId: 1 },
    params: { tweetId },
    query: { username },
    body: { text, video, oldImg },
    file: { location: image },
  }),
};

export const mockComment = {
  comment: {
    id: "",
    text: "",
    good: 1,
    tweetId: "",
    userId: 1,
    createdAt: {},
    updatedAt: {},
  },
  reqOptions: (
    commentId?: number,
    text = "",
    recipient = ""
  ): httpMocks.RequestOptions => ({
    user: { userId: 1 },
    params: { tweetId: 2, commentId },
    body: { text, recipient },
  }),
};

export const userData = {
  login: "mr.smith",
  name: "smith",
  avatar_url: "https://",
};

export const emailData = [{ email: "@" }];
