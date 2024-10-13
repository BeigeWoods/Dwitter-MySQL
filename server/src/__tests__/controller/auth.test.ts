import httpMocks from "node-mocks-http";
import AuthController from "../../controller/auth/auth";
import config from "../../config";
import ExceptionHandler from "../../exception/exception";
import { mockPassword, mockUser, mockUserForInput } from "../__mocked__/data";
import {
  mockedTokenController,
  mockedUserRepository,
} from "../__mocked__/handler";
import { mockBcrypt } from "../__mocked__/module";

jest.mock("bcrypt");

describe("AuthController", () => {
  const authController = new AuthController(
    config,
    mockedUserRepository,
    mockedTokenController,
    new ExceptionHandler("authController")
  );
  let response: httpMocks.MockResponse<any>,
    request: httpMocks.MockRequest<any>;
  const username = "mr.smith",
    email = "@",
    name = "smith";

  beforeEach(() => {
    response = httpMocks.createResponse();
  });

  describe("signup", () => {
    beforeEach(
      () =>
        (request = httpMocks.createRequest({
          body: mockUserForInput(false, { username, email }),
        }))
    );
    test("return status 409 when username already exists", async () => {
      mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
      mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(1));

      await authController.signup(request, response);

      expect(response.statusCode).toBe(409);
      expect(response._getJSONData()).toEqual({
        message: "username already exists",
      });
    });

    test("return status 409 and 'email already exists' when username and email exist", async () => {
      mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));
      mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(1));

      await authController.signup(request, response);

      expect(response.statusCode).toBe(409);
      expect(response._getJSONData()).toEqual({
        message: "email already exists",
      });
    });

    test("throw error when bcrypt has problem", async () => {
      mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
      mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);
      mockBcrypt.hash.mockRejectedValueOnce("hash error");

      await authController.signup(request, response).catch((e) => {
        expect(e.name).toBe("Error > authController.signup");
        expect(e.message).toBe("hash error");
      });
    });

    test("return status 201 when succeed", async () => {
      mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
      mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);
      mockBcrypt.hash.mockResolvedValueOnce("hashedPassword");
      mockedUserRepository.create.mockResolvedValueOnce(2);
      mockedTokenController.createJwtToken.mockReturnValue("token");

      await authController.signup(request, response);

      expect(mockedUserRepository.create).toHaveBeenCalledWith({
        ...mockUserForInput(false, {
          username,
          email,
          password: "hashedPassword",
        }),
        socialLogin: false,
      });
      expect(mockedTokenController.createJwtToken).toHaveBeenCalledWith(2);
      expect(mockedTokenController.setToken).toHaveBeenCalled();
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toEqual({
        token: "token",
        username,
      });
    });
  });

  describe("login", () => {
    beforeEach(
      () =>
        (request = httpMocks.createRequest({
          body: mockUserForInput(false, {
            username,
          }),
        }))
    );

    test("return status 400 when doesn't exist user which find by username", async () => {
      mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);

      await authController.login(request, response);

      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(mockedTokenController.createJwtToken).not.toHaveBeenCalled();
      expect(mockedTokenController.setToken).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toEqual({
        message: "Invalid user or password",
      });
    });

    test("return status 400 when result of bcrypt.compare about password is false", async () => {
      mockedUserRepository.findByUsername.mockResolvedValueOnce(
        mockUser(1, username)
      );
      mockBcrypt.compare.mockResolvedValue(false);

      await authController.login(request, response);

      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toEqual({
        message: "Invalid user or password",
      });
    });

    test("return status 201 when succeed", async () => {
      mockedUserRepository.findByUsername.mockResolvedValueOnce(
        mockUser(1, username)
      );
      mockBcrypt.compare.mockResolvedValue(true);
      mockedTokenController.createJwtToken.mockReturnValue("token");

      await authController.login(request, response);

      expect(mockedTokenController.createJwtToken).toHaveBeenCalledWith(1);
      expect(mockedTokenController.setToken).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual({
        token: "token",
        username,
      });
    });
  });

  describe("updateUser", () => {
    test("return status 409 when data of name and email is given but email already exists", async () => {
      request = httpMocks.createRequest({
        user: { id: 2 },
        body: mockUserForInput(true, {
          name,
          email,
        }),
      });
      mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

      await authController.updateUser(request, response);

      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        request.body.email
      );
      expect(mockedUserRepository.findByUsername).not.toHaveBeenCalled();
      expect(mockedUserRepository.update).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(409);
      expect(response._getJSONData()).toEqual({
        message: "email already exists",
      });
    });

    test("return status 201 when data of name is given and succeed", async () => {
      request = httpMocks.createRequest({
        user: { id: 2 },
        body: mockUserForInput(true, {
          name,
        }),
      });

      await authController.updateUser(request, response);

      expect(mockedUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockedUserRepository.findByUsername).not.toHaveBeenCalled();
      expect(mockedUserRepository.update).toHaveBeenCalledWith(2, request.body);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toEqual(request.body);
    });
  });

  describe("updatePassword", () => {
    test("return status 403 when social login users access", async () => {
      request = httpMocks.createRequest({
        user: { socialLogin: true },
      });

      await authController.updatePassword(request, response);

      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockedUserRepository.updatePassword).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(403);
    });

    test("return status 400 when given password doesn't match user's password", async () => {
      request = httpMocks.createRequest({
        user: { password: "hashedPassword" },
        body: mockPassword({}),
      });
      mockBcrypt.compare.mockResolvedValueOnce(false);

      await authController.updatePassword(request, response);

      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toEqual({
        message: "Incorrect password",
      });
    });

    test("return status 400 when password and newPassword are same", async () => {
      request = httpMocks.createRequest({
        user: { password: "hashedPassword" },
        body: mockPassword({
          newPassword: "1234",
        }),
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);

      await authController.updatePassword(request, response);

      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toEqual({
        message: "Do not use the old password again",
      });
    });

    test("return status 400 when newPassword and checkPassword are different", async () => {
      request = httpMocks.createRequest({
        user: { password: "hashedPassword" },
        body: mockPassword({
          checkPassword: "qwert",
        }),
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);

      await authController.updatePassword(request, response);

      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockedUserRepository.updatePassword).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toEqual({
        message: "Incorrect password",
      });
    });

    test("return status 204 when succed", async () => {
      request = httpMocks.createRequest({
        user: { id: 2, password: "hashedPassword" },
        body: mockPassword({}),
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      mockBcrypt.hash.mockResolvedValueOnce("newhashedPassword");
      mockedUserRepository.updatePassword.mockResolvedValueOnce();

      await authController.updatePassword(request, response);

      expect(mockedUserRepository.updatePassword).toHaveBeenCalledWith(
        2,
        "newhashedPassword"
      );
      expect(response.statusCode).toBe(204);
    });
  });
});
