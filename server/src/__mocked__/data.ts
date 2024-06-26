import httpMocks from "node-mocks-http";
import { OutputUser } from "../__dwitter__.d.ts/data/user";
import { OutputTweet } from "../__dwitter__.d.ts/data/tweet";

export const mockUser = (userId: number, username = ""): OutputUser => ({
  id: userId,
  username,
  name: "",
  email: "",
  password: "",
  socialLogin: true,
});

export const mockTweet = {
  tweet: (text = "", video = "", image = ""): OutputTweet => ({
    username: "",
    name: "",
    url: "",
    id: 2,
    text,
    video,
    image,
    good: 1,
    createdAt: {},
    updatedAt: {},
    clicked: 1,
    userId: 1,
  }),
  reqOptions: (
    tweetId?: number,
    text = "",
    video = "",
    image = "",
    username = ""
  ): httpMocks.RequestOptions => ({
    user: { id: 1 },
    params: { tweetId },
    query: { username },
    body: { text, video },
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
    user: { id: 1 },
    params: { tweetId: 2, commentId },
    body: { text, recipient },
  }),
};

export const mockOauth = {
  ownerData: {
    login: "mr.smith",
    name: "smith",
    avatar_url: "https://",
  },
  emailData: [{ email: "@" }],
  reqOptions: (
    code: "code" | "null" | "undefined" | "error"
  ): httpMocks.RequestOptions => ({
    query: { state: "state", code },
  }),
};
