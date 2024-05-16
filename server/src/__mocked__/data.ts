import { OutputUserInfo } from "../__dwitter__.d.ts/data/user";
import { CommentData } from "../__dwitter__.d.ts/data/comments";
import { TweetData } from "../__dwitter__.d.ts/data/tweet";

export const mockUser = (userId: number, username = ""): OutputUserInfo => ({
  userId,
  username,
  name: "",
  email: "",
  password: "",
  socialLogin: true,
});

export const mockTweet = (
  text = "",
  video = "",
  image = "",
  userId = 1
): TweetData => ({
  username: "",
  name: "",
  url: "",
  tweetId: "",
  text,
  video,
  image,
  good: 1,
  createdAt: {},
  userId,
});

export const mockComment: CommentData = {
  id: "",
  text: "",
  good: 1,
  tweetId: "",
  userId: 1,
  createdAt: {},
  updatedAt: {},
};
