import faker from "faker";
import httpMocks from "node-mocks-http";
import { validationResult as validation } from "express-validator";
import {
  expressValidate,
  tweetFormDataValidate,
  paramsValidate,
} from "../validator";

jest.mock("express-validator");

describe.skip("Validator Middleware", () => {
  let request: httpMocks.MockRequest<any>;
  let response: httpMocks.MockResponse<any>;
  let next: jest.Mock;

  beforeEach(() => {
    request = httpMocks.createRequest();
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  describe("expressValidate", () => {
    const validationResult = validation as unknown as jest.Mock;

    it("calls next if there no validation errors", () => {
      validationResult.mockImplementation(() => ({
        isEmpty: () => true,
      }));

      expressValidate(request, response, next);

      expect(next).toBeCalled();
    });

    it("returns 400 if there are validation errors", () => {
      validationResult.mockImplementation(() => ({
        isEmpty: () => false,
        array: () => [{ msg: "Error!" }],
      }));

      expressValidate(request, response, next);

      expect(response.statusCode).toBe(400);
      expect(next).not.toBeCalled();
      expect(response._getJSONData().message).toBe("Error!");
    });
  });

  describe("tweetFormDataValidate", () => {
    it("return 400 if all data isn't provided", () => {
      request = httpMocks.createRequest(undefined);

      tweetFormDataValidate(request, response, next);

      expect(response.statusCode).toBe(400);
      expect(response._getJSONData().message).toBe("Invalid value(s)");
      expect(next).not.toBeCalled();
    });

    it("return 400 if wrong video url is provided", () => {
      request = httpMocks.createRequest({
        body: { video: faker.internet.url() },
      });

      tweetFormDataValidate(request, response, next);

      expect(response.statusCode).toBe(400);
      expect(response._getJSONData().message).toBe("Invalid url");
      expect(next).not.toBeCalled();
    });

    it("success validation when right video url is provided", () => {
      const videoUrl = "https://youtu.be/q_VsCxx3jpo";
      request = httpMocks.createRequest({
        body: { video: videoUrl },
      });

      tweetFormDataValidate(request, response, next);

      expect(next).toBeCalled();
    });
  });

  describe("paramsValidate", () => {
    it("return 404 if req.params.id doesn’t exist in operating tweet", () => {
      request = httpMocks.createRequest({
        path: "/1",
        params: { id: undefined },
      });

      paramsValidate(request, response, next);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData().message).toBe("Bad tweet id");
      expect(next).not.toBeCalled();
    });

    it("return 404 if req.params.id is 'undefined' in operating tweet", () => {
      request = httpMocks.createRequest({
        path: "/",
        params: { id: "undefined" },
      });

      paramsValidate(request, response, next);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData().message).toBe("Bad tweet id");
      expect(next).not.toBeCalled();
    });

    it("calls next if req.params.id is exist in operating tweet", () => {
      request = httpMocks.createRequest({
        path: "/1",
        params: { id: 1 },
      });

      paramsValidate(request, response, next);

      expect(next).toBeCalled();
    });

    it("return 404 if req.params.id is doesn’t exist in posting comment", () => {
      request = httpMocks.createRequest({
        path: "/undefined/comments",
        method: "POST",
        params: { id: "undefined" },
      });

      paramsValidate(request, response, next);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData().message).not.toBe("Bad tweet id");
      expect(response._getJSONData().message).toBe("Bad comment id");
      expect(next).not.toBeCalled();
    });

    it("calls next if only req.params.main is provided in updating comment", () => {
      request = httpMocks.createRequest({
        path: "/undefined/comments/1",
        method: "PUT",
        params: { id: "undefined", main: "1" },
      });

      paramsValidate(request, response, next);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData().message).not.toBe("Bad tweet id");
      expect(response._getJSONData().message).toBe("Bad comment id");
      expect(next).not.toBeCalled();
    });

    it("return 404 if req.params.main doesn’t exist in updating comment", () => {
      request = httpMocks.createRequest({
        path: "/1/comments/undefined",
        method: "PUT",
        params: { id: "1", main: undefined },
      });

      paramsValidate(request, response, next);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData().message).not.toBe("Bad tweet id");
      expect(response._getJSONData().message).toBe("Bad comment id");
      expect(next).not.toBeCalled();
    });

    it("calls next if req.params.main and id are provided in updating comment", () => {
      request = httpMocks.createRequest({
        path: "/10/comments/1",
        method: "PUT",
        params: { id: "10", main: "1" },
      });

      paramsValidate(request, response, next);

      expect(next).toBeCalled();
    });

    it("return 404 if only req.params.main is provided in deleting comment", () => {
      request = httpMocks.createRequest({
        path: "/undefined/comments/1",
        method: "DELETE",
        params: { id: "undefined", main: "1" },
      });

      paramsValidate(request, response, next);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData().message).not.toBe("Bad tweet id");
      expect(response._getJSONData().message).toBe("Bad comment id");
      expect(next).not.toBeCalled();
    });

    it("return 404 if req.params.main doesn’t exist in deleting comment", () => {
      request = httpMocks.createRequest({
        path: "/10/comments/undefined",
        method: "DELETE",
        params: { id: "10", main: "undefined" },
      });

      paramsValidate(request, response, next);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData().message).not.toBe("Bad tweet id");
      expect(response._getJSONData().message).toBe("Bad comment id");
      expect(next).not.toBeCalled();
    });

    it("calls next if req.params.main and id are provided in deleting comment", () => {
      request = httpMocks.createRequest({
        path: "/10/comments/1",
        method: "DELETE",
        params: { id: "10", main: "1" },
      });

      paramsValidate(request, response, next);

      expect(next).toBeCalled();
    });
  });
});
