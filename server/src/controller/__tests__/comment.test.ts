import httpMocks from "node-mocks-http";
import faker from "faker";
import { CommentHandler } from "../../__dwitter__.d.ts/controller/comments";
import { CommentDataHandler } from "../../__dwitter__.d.ts/data/comments";
import { CommentController } from "../comments";
import { UserDataHandler } from "../../__dwitter__.d.ts/data/auth";

describe("Comment Controller", () => {
  let commentController: CommentHandler;
  let commentRepository: jest.Mocked<CommentDataHandler | any> = {};
  let userRepository: jest.Mocked<UserDataHandler | any> = {};
  let mockedSocket: jest.Mocked<any>;
  let response: httpMocks.MockResponse<any>;
  let request: httpMocks.MockRequest<any>;
  let text: string = faker.random.words(3);
  let userId: number = 1;
  let tweetId: string = "2";
  let good: number = 0;
  let commentId: string = "3";
  let repliedUser: string | undefined = "smith";
  let comment: any = { commentId, text, good, repliedUser, userId, tweetId };

  beforeEach(() => {
    mockedSocket = { emit: jest.fn() };
    commentController = new CommentController(
      commentRepository,
      userRepository,
      () => mockedSocket
    );
    response = httpMocks.createResponse();
  });

  describe("getComments", () => {
    it("returns all comments when all data is provided", async () => {
      request = httpMocks.createRequest({
        params: { tweetId },
        userId,
      });
      const allComments = [
        { text, good, repliedUser },
        { text, good, repliedUser },
      ];
      commentRepository.getAll = jest.fn(() => allComments);

      await commentController.getComments(request, response);

      expect(response.statusCode).toBe(200);
      expect(commentRepository.getAll).toHaveBeenCalledWith(tweetId, userId);
      expect(response._getJSONData()).toEqual(allComments);
    });
  });

  describe("createComment", () => {
    let user = { username: repliedUser };
    beforeEach(() => {
      request = httpMocks.createRequest({
        params: { tweetId },
        body: { text, repliedUser },
        userId,
      });
      commentRepository.create = jest.fn(() => comment);
      userRepository.findByUsername = jest.fn(() => user);
    });

    it("returns comment when all data is provided", async () => {
      await commentController.createComment(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toEqual(comment);
      expect(userRepository.findByUsername).toHaveBeenCalledWith(repliedUser);
      expect(commentRepository.create).toHaveBeenCalledWith(
        userId,
        tweetId,
        text,
        repliedUser
      );
    });

    it("returns status 409 when all data is provided but user doesn't exist", async () => {
      userRepository.findByUsername = jest.fn();

      await commentController.createComment(request, response);

      expect(response.statusCode).toBe(409);
      expect(userRepository.findByUsername).toHaveBeenCalledWith(repliedUser);
      expect(response._getJSONData()).toEqual({
        message: "Replied user not found",
      });
      expect(commentRepository.create).not.toHaveBeenCalled();
    });

    it("returns comment when only repliedUser isn't provided", async () => {
      request = httpMocks.createRequest({
        params: { tweetId },
        body: { text },
        userId,
      });

      await commentController.createComment(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toEqual(comment);
      expect(userRepository.findByUsername).not.toHaveBeenCalled();
      expect(commentRepository.create).toHaveBeenCalledWith(
        userId,
        tweetId,
        text,
        ""
      );
    });

    it("send comment data to websocket", async () => {
      await commentController.createComment(request, response);

      expect(mockedSocket.emit).toHaveBeenLastCalledWith("comments", comment);
    });
  });

  describe("updateComment", () => {
    it("return updated comment when all data is provided", async () => {
      commentRepository.update = jest.fn(() => comment);
      request = httpMocks.createRequest({
        params: { tweetId, commentId },
        body: { text, repliedUser },
        userId,
      });

      await commentController.updateComment(request, response);

      expect(commentRepository.update).toHaveBeenCalledWith(
        tweetId,
        commentId,
        userId,
        text
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject(comment);
    });
  });

  describe("deleteComment", () => {
    it("response 204 when commentId and tweetId is provided", async () => {
      request = httpMocks.createRequest({
        params: { tweetId, commentId },
        userId,
      });
      commentRepository.remove = jest.fn();

      await commentController.deleteComment(request, response);

      expect(response.statusCode).toBe(204);
      expect(commentRepository.remove).toHaveBeenCalledWith(commentId);
    });
  });
});
