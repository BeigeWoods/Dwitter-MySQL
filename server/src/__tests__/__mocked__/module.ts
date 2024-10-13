import { hash, compare } from "bcrypt";

export const mockBcrypt = {
  hash: hash as jest.Mock,
  compare: compare as jest.Mock,
};
