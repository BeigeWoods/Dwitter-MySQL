import UserRepository from "../user";
import { db } from "../../db/database";

jest.mock("../../db/database");

describe("UserRepository", () => {
  let mockedExeute: jest.Spied<typeof db.execute>;
  const userRepository = new UserRepository();
  const errorLog = jest.spyOn(console, "error");
  const errorCallback = jest.fn((err: any) => err);

  test("will return callback and console outputs error message if error occur", async () => {
    mockedExeute = jest.spyOn(db, "execute").mockRejectedValue(new Error("No"));

    await userRepository.deleteUser(1, errorCallback).catch((error) => {
      expect(error.message).toBe("No");
      expect(errorLog).toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
    });
  });
});
