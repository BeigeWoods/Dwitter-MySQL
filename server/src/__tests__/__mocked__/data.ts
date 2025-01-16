import httpMocks from "node-mocks-http";
import {
  OutputUser,
  Password,
  UserForCreate,
} from "../../__dwitter__.d.ts/data/user";
import { InputTweet, OutputTweet } from "../../__dwitter__.d.ts/data/tweet";

export const mockUser = (userId: number, username = ""): OutputUser => ({
  id: userId,
  username,
  name: "",
  email: "",
  password: "",
  socialLogin: true,
});

export const mockUserForInput = (
  isUpdate: boolean,
  user?: Partial<UserForCreate>
) => {
  const basic = {
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    url: user?.url || "",
  };
  return isUpdate
    ? basic
    : {
        ...basic,
        password: user?.password || "1234",
      };
};

export const mockPassword = (pw: Partial<Password>): Partial<Password> => ({
  password: pw.password || "1234",
  newPassword: pw.newPassword || "qwer",
  checkPassword: pw.checkPassword || "qwer",
});

export const mockTweet = {
  tweet: (tweet?: InputTweet): OutputTweet => ({
    username: "",
    name: "",
    url: "",
    id: 2,
    text: tweet?.text || "",
    video: tweet?.video || "",
    image: tweet?.image || "",
    good: 1,
    createdAt: "today" as any,
    updatedAt: "now" as any,
    clicked: true,
    userId: 1,
  }),
  reqOptions: (
    tweetId?: number,
    tweet?: InputTweet & {
      newImage?: string;
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
    id: 1,
    text: "",
    good: 1,
    tweetId: "",
    userId: 1,
    recipient: "",
    clicked: false,
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
