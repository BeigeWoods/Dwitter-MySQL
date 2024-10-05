import httpMocks from "node-mocks-http";
import faker from "faker";
import { NextFunction } from "express";
import CommentController from "../../controller/comments";
import {
  mockedCommentRepository,
  mockedUserRepository,
} from "../__mocked__/handler";
import { mockComment, mockUser } from "../__mocked__/data";
import ExceptionHandler from "../../exception/exception";

describe("Comment Controller", () => {
  const mockedSocket: jest.Mocked<any> = { emit: jest.fn() };
  const commentController = new CommentController(
    mockedCommentRepository,
    mockedUserRepository,
    () => mockedSocket,
    new ExceptionHandler("commentController")
  );
  const userId = 1,
    tweetId = 2,
    commentId = 3,
    text = faker.random.words(3),
    recipient = "smith";
  let response: httpMocks.MockResponse<any>,
    request: httpMocks.MockRequest<any>,
    next: jest.Mock<NextFunction>;

  beforeEach(() => {
    response = httpMocks.createResponse();
  });

  describe("getAll", () => {
    test("returns all comments when all data is provided", async () => {
      request = httpMocks.createRequest(mockComment.reqOptions());
      mockedCommentRepository.getAll.mockResolvedValueOnce([
        mockComment.comment,
      ]);

      await commentController.getAll(request, response);

      expect(mockedCommentRepository.getAll).toHaveBeenCalledWith(
        tweetId,
        userId
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual([mockComment.comment]);
    });
  });

  describe("create", () => {
    test("returns status 409 when recipient is a non-existent user", async () => {
      request = httpMocks.createRequest(
        mockComment.reqOptions(NaN, text, recipient)
      );
      mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);

      await commentController.create(request, response);

      expect(mockedUserRepository.findByUsername).toHaveBeenCalledWith(
        recipient
      );
      expect(response.statusCode).toBe(409);
      expect(response._getJSONData()).toEqual({
        message: "Replied user not found",
      });
      expect(mockedCommentRepository.create).not.toHaveBeenCalled();
      expect(mockedSocket.emit).not.toHaveBeenCalled();
    });

    test("returns comment and sends data to websocket when recipient isn't provided", async () => {
      request = httpMocks.createRequest(mockComment.reqOptions(NaN, text));
      mockedCommentRepository.create.mockResolvedValueOnce(mockComment.comment);

      await commentController.create(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toEqual(mockComment.comment);
      expect(mockedUserRepository.findByUsername).not.toHaveBeenCalled();
      expect(mockedCommentRepository.create).toHaveBeenCalledWith(
        userId,
        tweetId,
        text,
        ""
      );
    });

    test("returns reply and sends data to websocket when all data is provided", async () => {
      request = httpMocks.createRequest(
        mockComment.reqOptions(NaN, text, recipient)
      );
      mockedUserRepository.findByUsername.mockResolvedValueOnce(
        mockUser(1, recipient)
      );
      mockedCommentRepository.create.mockResolvedValueOnce(mockComment.comment);

      await commentController.create(request, response);

      expect(mockedUserRepository.findByUsername).toHaveBeenCalledWith(
        recipient
      );
      expect(mockedCommentRepository.create).toHaveBeenCalledWith(
        userId,
        tweetId,
        text,
        recipient
      );
      expect(mockedSocket.emit).toHaveBeenCalledWith(
        "comments",
        mockComment.comment
      );
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toEqual(mockComment.comment);
    });
  });

  describe("update", () => {
    test("calls next middleware when DB returns nothing of updating comment", async () => {
      request = httpMocks.createRequest(
        mockComment.reqOptions(commentId, text, recipient)
      );
      mockedCommentRepository.update.mockResolvedValueOnce();

      await commentController.update(request, response);

      expect(mockedCommentRepository.update).toHaveBeenCalledWith(
        tweetId,
        commentId,
        userId,
        text
      );
    });
  });

  describe("delete", () => {
    test("calls next middleware when DB returns error by callback", async () => {
      request = httpMocks.createRequest(mockComment.reqOptions(commentId));
      mockedCommentRepository.delete.mockRejectedValueOnce("Error");

      await commentController.delete(request, response).catch((e) => {
        expect(e.name).toBe("Error > commentController.delete");
        expect(e.message).toBe("Error");
      });

      expect(mockedCommentRepository.delete).toHaveBeenCalledWith(commentId);
      expect(response.statusCode).not.toBe(204);
    });

    test("returns status 204 when succeeds to deleting", async () => {
      request = httpMocks.createRequest(mockComment.reqOptions(commentId));
      mockedCommentRepository.delete.mockResolvedValueOnce(undefined);

      await commentController.delete(request, response);

      expect(mockedCommentRepository.delete).toHaveBeenCalledWith(commentId);
      expect(response.statusCode).toBe(204);
    });
  });
});
