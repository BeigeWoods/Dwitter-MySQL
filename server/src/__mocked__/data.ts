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
    createdAt: "today" as any,
    updatedAt: "now" as any,
    clicked: 1,
    userId: 1,
  }),
  reqOptions: (
    tweetId?: number,
    tweet?: {
      text?: string;
      video?: string;
      newImage?: string;
      image?: string;
    },
    username?: string
  ): httpMocks.RequestOptions => ({
    user: { id: 1 },
    params: { tweetId },
    query: { username },
    body: {
      text: tweet?.text || "",
      video: tweet?.video || "",
      image: tweet?.image || "",
    },
    file: { location: tweet?.newImage || "" },
  }),
};

export const mockComment = {
  comment: {
    id: "",
    text: "",
    good: 1,
    tweetId: "",
    userId: 1,
    createdAt: "today" as any,
    updatedAt: "now" as any,
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
  emailData: "@",
  reqOptions: {
    query: { state: "state", code: "code" },
  },
};
