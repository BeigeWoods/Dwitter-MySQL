import faker from "faker";
import httpMocks from "node-mocks-http";
import { validationResult as validation } from "express-validator";
import { expressValidate, tweetFormDataValidate } from "../validator";

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
});
