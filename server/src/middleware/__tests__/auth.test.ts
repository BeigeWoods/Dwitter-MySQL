import httpMocks from "node-mocks-http";
import faker from "faker";
import { NextFunction } from "express";
import { verify as verifying } from "jsonwebtoken";
import AuthValidator from "../auth";
import config from "../../config";
import { mockedUserRepository } from "../../__mocked__/repository";
import { mockUser } from "../../__mocked__/data";

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  const authMiddleware = new AuthValidator(config, mockedUserRepository);
  const verify = verifying as jest.Mock;
  const userId = 1,
    headers = {
      headers: { Authorization: `Bearer ${faker.random.alphaNumeric(3)}` },
    };
  let request: httpMocks.MockRequest<any>,
    response: httpMocks.MockResponse<any>,
    next: jest.Mock<NextFunction>;

  beforeEach(() => {
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("returns status 401 for the request without Authorization", async () => {
    request = httpMocks.createRequest();

    await authMiddleware.isAuth(request, response, next);

    expect(response.statusCode).toBe(401);
    expect(response._getJSONData().message).toBe("Authentication Error");
    expect(next).not.toHaveBeenCalled();
  });

  describe("Check Authorization header for Non-Browser Client", () => {
    test("returns status 401 for the request with unsupposed Authorization header", async () => {
      request = httpMocks.createRequest({
        headers: { Authorization: `Basic` },
      });

      await authMiddleware.isAuth(request, response, next);

      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe("Authentication Error");
      expect(next).not.toHaveBeenCalled();
    });

    test("returns status 401 for the request with invalid JWT", async () => {
      request = httpMocks.createRequest(headers);
      verify.mockImplementation((token, secret, callback) =>
        callback(new Error("Bad Token"), undefined)
      );
      const error = jest
        .spyOn(console, "error")
        .mockImplementation(() => "Bad Token");

      await authMiddleware.isAuth(request, response, next);

      expect(error).toHaveBeenCalled();
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe("Authentication Error");
      expect(next).not.toHaveBeenCalled();
    });

    test("returns status 401 when cannot find a user by id from the JWT", async () => {
      request = httpMocks.createRequest(headers);
      verify.mockImplementation((token, secret, callback) =>
        callback(undefined, { id: userId })
      );

      await authMiddleware.isAuth(request, response, next);

      expect(mockedUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe("Authentication Error");
      expect(next).not.toHaveBeenCalled();
    });

    test("succeeds Authorization", async () => {
      request = httpMocks.createRequest(headers);
      verify.mockImplementation((token, secret, callback) =>
        callback(undefined, { id: userId })
      );
      mockedUserRepository.findById.mockReturnValueOnce(
        Promise.resolve(mockUser(userId))
      );

      await authMiddleware.isAuth(request, response, next);

      expect(request.user).toMatchObject(mockUser(userId));
      expect(next).toHaveBeenCalled();
    });
  });
});
