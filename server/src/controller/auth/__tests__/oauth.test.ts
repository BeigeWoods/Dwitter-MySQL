import { emailData, mockUser, userData } from "../../../__mocked__/data";
import { mockedUserRepository } from "../../../__mocked__/repository";

describe("OauthController.signIn", () => {
  const mockJWTCreateToken = jest.fn(
    (userId: number, whatCase: string) => "token"
  );
  async function signIn(userData: any, emailData: any) {
    const user = await mockedUserRepository.findByUserEmail(emailData[0].email);
    switch (typeof user) {
      case "number":
        return "the problem of findByUserEmail";
      case "undefined":
        const userId = await mockedUserRepository.createUser({
          username: userData!.login,
          password: "",
          name: userData!.name,
          email: emailData[0].email,
          url: userData!.avatar_url,
          socialLogin: true,
        });
        return userId
          ? {
              token: mockJWTCreateToken(userId, "undefined"),
              username: userData!.login as string,
            }
          : "the problem of createUser";
    }
    return {
      token: mockJWTCreateToken(user.id, "nothing"),
      username: user.username,
    };
  }

  test("returns 1 when DB returns 1 at finding user by email", async () => {
    mockedUserRepository.findByUserEmail.mockResolvedValueOnce(1);

    const result = await signIn(userData, emailData);

    expect(result).toBe("the problem of findByUserEmail");
  });

  test("returns token and username when DB returns user data", async () => {
    mockedUserRepository.findByUserEmail.mockResolvedValueOnce(
      mockUser(1, "bob")
    );

    const result = await signIn(userData, emailData);

    expect(mockedUserRepository.findByUserEmail).toHaveBeenCalledWith("@");
    expect(mockJWTCreateToken).toHaveBeenCalledWith(1, "nothing");
    expect(result).toMatchObject({ token: "token", username: "bob" });
  });

  test("returns undefined when DB returns nothing at creating user", async () => {
    mockedUserRepository.createUser.mockResolvedValueOnce(undefined);

    const result = await signIn(userData, emailData);

    expect(result).toBe("the problem of createUser");
  });

  test("returns token and username when DB returns userId at creating user", async () => {
    mockedUserRepository.createUser.mockResolvedValueOnce(2);

    const result = await signIn(userData, emailData);

    expect(mockJWTCreateToken).toHaveBeenCalledWith(2, "undefined");
    expect(result).toMatchObject({ token: "token", username: "mr.smith" });
  });
});
