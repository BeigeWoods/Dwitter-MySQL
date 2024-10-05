import { OutputUser } from "../../../__dwitter__.d.ts/data/user";
import { mockUser } from "../../../__mocked__/data";
import { mockedUserRepository } from "../../../__mocked__/handler";

describe("AuthController.isDuplicateEmailOrUsername", () => {
  const email = "@1",
    username = "smith";
  const isDuplicateEmailOrUsername = jest.fn(
    async (email: string, username: string) => {
      let result: OutputUser;
      result = (await mockedUserRepository.findByEmail(email)) as OutputUser;
      if (result) return email;

      result = (await mockedUserRepository.findByUsername(
        username
      )) as OutputUser;
      if (result) return username;
    }
  );
  async function validateDuple(email: string, username: string) {
    const isDuplicate = await isDuplicateEmailOrUsername(email, username).catch(
      (e) => {
        throw `${e} > authController`;
      }
    );
    return isDuplicate && "status 409";
  }

  describe("isDuplicateEmailOrUsername", () => {
    test("occurs error when DB has a issue at finding user by email", async () => {
      mockedUserRepository.findByEmail.mockRejectedValueOnce("Error");

      const result = await isDuplicateEmailOrUsername(email, username).catch(
        (e) => expect(e).toBe("Error")
      );

      expect(mockedUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockedUserRepository.findByUsername).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    test("returns username when username is duplicate", async () => {
      mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
      mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(1));

      const result = await isDuplicateEmailOrUsername(email, username).catch(
        (e) => expect(e).toBeUndefined()
      );

      expect(mockedUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockedUserRepository.findByUsername).toHaveBeenCalled();
      expect(result).toBe(username);
    });

    test("returns nothing when email or username isn't duplicate", async () => {
      mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
      mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);

      const result = await isDuplicateEmailOrUsername(email, username).catch(
        (e) => expect(e).toBeUndefined()
      );

      expect(mockedUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockedUserRepository.findByUsername).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("signUp and updateUser validateDuple using isDuplicateEmailOrUsername", () => {
    test("returns 'next()' when validateDuple catches error", async () => {
      mockedUserRepository.findByEmail.mockRejectedValueOnce("Error");

      await validateDuple(email, username).catch((e) =>
        expect(e).toBe("Error > authController")
      );
    });

    test("returns 'status 409' when validateDuple receives email or username", async () => {
      mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

      const result = await validateDuple(email, username);

      expect(result).toBe("status 409");
    });

    test("returns undefined when validateDuple receives nothing", async () => {
      mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
      mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);

      const result = await validateDuple(email, username);

      expect(result).toBeUndefined();
    });
  });
});
