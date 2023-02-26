import httpMocks from "node-mocks-http";
import faker from "faker";
import { verify as verifying } from "jsonwebtoken";
import AuthValidator, { AuthValidateHandler } from "../auth";
import { config } from "../../config";
import type { UserDataHandler } from "../../data/auth";

jest.mock("jsonwebtoken");

describe.skip("Auth Middleware", () => {
  let response: httpMocks.MockResponse<any>;
  let next: jest.Mock;
  let authMiddleware: AuthValidateHandler;
  let userRepository: jest.Mocked<UserDataHandler | any>;
  const verify = verifying as jest.Mock;

  beforeEach(() => {
    userRepository = {};
    authMiddleware = new AuthValidator(config, userRepository);
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  it("returns 401 for the request without Authorization", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      url: "/",
    });

    await authMiddleware.isAuth(request, response, next);

    expect(response.statusCode).toBe(401);
    expect(response._getJSONData().message).toBe("Authentication Error");
    expect(next).not.toBeCalled();
  });

  describe("Check Authorization header for Non-Browser Client", () => {
    it("returns 401 for the request with unsupposed Authorization header", async () => {
      const request = httpMocks.createRequest({
        method: "GET",
        url: "/",
        headers: { Authorization: `Basic` },
      });

      await authMiddleware.isAuth(request, response, next);

      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe("Authentication Error");
      expect(next).not.toBeCalled();
    });

    it("returns 401 for the request with invalid JWT", async () => {
      const token = faker.random.alphaNumeric(128);
      const error = jest
        .spyOn(console, "error")
        .mockImplementation(() => "bad Token");
      const request = httpMocks.createRequest({
        method: "GET",
        url: "/",
        headers: { Authorization: `Bearer ${token}` },
      });
      // jest.mock("jsonwebtoken", () => ({
      //   verify: jest.fn((token, secret, callback) => {
      //     return callback(new Error("bad Token"), undefined);
      //   }),
      // }));
      verify.mockImplementation((token, secret, callback) => {
        callback(new Error("bad Token"), undefined);
      });

      await authMiddleware.isAuth(request, response, next);

      expect(response.statusCode).toBe(401);
      expect(error).toBeCalled();
      expect(response._getJSONData().message).toBe("Authentication Error");
      expect(next).not.toBeCalled();
    });

    it("returns 401 when cannot find a user by id from the JWT", async () => {
      const token = faker.random.alphaNumeric(128);
      const userId = faker.random.alphaNumeric(32);
      const request = httpMocks.createRequest({
        method: "GET",
        url: "/",
        headers: { Authorization: `Bearer ${token}` },
      });
      // jest.mock("jsonwebtoken", () => ({
      //   verify: jest.fn((token, secret, callback) => {
      //     return callback(undefined, { id: userId });
      //   }),
      // }));
      verify.mockImplementation((token, secret, callback) => {
        callback(undefined, { id: userId });
      });

      userRepository.findById = jest.fn((id) => Promise.resolve(undefined));

      await authMiddleware.isAuth(request, response, next);

      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe("Authentication Error");
      expect(next).not.toBeCalled();
    });

    it("success Authorization", async () => {
      const token = faker.random.alphaNumeric(128);
      const userId = faker.random.alphaNumeric(32);
      const request = httpMocks.createRequest({
        method: "GET",
        url: "/",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Object.defineProperty(jwt, "verify", {
      //   value: jest.fn((token, secret, callback) => {
      //     callback(undefined, { id: userId });
      //   }),
      // });
      // jest.mock("jsonwebtoken", () => ({
      //   verify: jest.fn((token, secret, callback) => {
      //     callback(undefined, { id: userId });
      //   }),
      // }));
      verify.mockImplementation((token, secret, callback) => {
        callback(undefined, { id: userId });
      });
      userRepository.findById = jest.fn((id) => Promise.resolve({ id }));
      // Object.defineProperty(userRepository, "findById", {
      //   value: jest.fn((id) => Promise.resolve({ id: userId })),
      // });

      await authMiddleware.isAuth(request, response, next);

      expect(request).toMatchObject({ userId, token });
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
