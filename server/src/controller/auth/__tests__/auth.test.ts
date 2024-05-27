import { OutputUser } from "../../../__dwitter__.d.ts/data/user";
import { mockUser } from "../../../__mocked__/data";
import { mockedUserRepository } from "../../../__mocked__/repository";

describe("AuthController.isDuplicateEmailOrUsername", () => {
  const email = "@1",
    username = "smith";
  const isDuplicateEmailOrUsername = jest.fn(
    async (email: string, username: string) => {
      let result: number | void | OutputUser;
      result = await mockedUserRepository.findByUserEmail(email);
      if (result) {
        return Number(result) ? 1 : email;
      }
      result = await mockedUserRepository.findByUsername(username);
      if (result) {
        return Number(result) ? 1 : username;
      }
      return 0;
    }
  );

  describe("isDuplicateEmailOrUsername", () => {
    test("returns 1 when DB has a issue at finding user by email", async () => {
      mockedUserRepository.findByUserEmail.mockResolvedValueOnce(1);

      const result = await isDuplicateEmailOrUsername(email, username);

      expect(mockedUserRepository.findByUserEmail).toHaveBeenCalled();
      expect(mockedUserRepository.findByUsername).not.toHaveBeenCalled();
      expect(result).toBe(1);
    });

    test("returns username when username is duplicate", async () => {
      mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(1));

      const result = await isDuplicateEmailOrUsername(email, username);

      expect(mockedUserRepository.findByUserEmail).toHaveBeenCalled();
      expect(mockedUserRepository.findByUsername).toHaveBeenCalled();
      expect(result).toBe(username);
    });

    test("returns 0 when email or username isn't duplicate", async () => {
      const result = await isDuplicateEmailOrUsername(email, username);

      expect(mockedUserRepository.findByUserEmail).toHaveBeenCalled();
      expect(mockedUserRepository.findByUsername).toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe("signUp and updateUser method using isDuplicateEmailOrUsername", () => {
    async function method(email: string, username: string) {
      const isDuplicate = await isDuplicateEmailOrUsername(email, username);
      if (isDuplicate) {
        return Number(isDuplicate) ? "next()" : "status 409";
      }
    }

    test("returns 'next()' when method receives 1", async () => {
      mockedUserRepository.findByUserEmail.mockResolvedValueOnce(1);

      const result = await method(email, username);

      expect(result).toBe("next()");
    });

    test("returns 'status 409' when method receives email or username", async () => {
      mockedUserRepository.findByUserEmail.mockResolvedValueOnce(mockUser(1));

      const result = await method(email, username);

      expect(result).toBe("status 409");
    });

    test("returns undefined when method receives 0", async () => {
      const result = await method(email, username);

      expect(result).toBeUndefined();
    });
  });
});
