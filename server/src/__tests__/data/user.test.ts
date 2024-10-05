import { UserForUpdate } from "../../__dwitter__.d.ts/data/user";

describe("User Repository", () => {
  describe("Handling query", () => {
    const forLoop = {
      queryToUpdateUser: (user: UserForUpdate) => {
        let result = "";
        let key: keyof UserForUpdate;
        for (key in user) {
          if (user[key]) {
            if (result) result += ", ";
            result += key + " = ?";
          }
        }
        return result;
      },
      valuesToUpdateUser: (user: UserForUpdate) => {
        let result: any[] = [];
        let key: keyof UserForUpdate;
        for (key in user) {
          if (user[key]) result.push(user[key]);
        }
        return result;
      },
    };
    const ifState = {
      queryToUpdateUser: (user: UserForUpdate) => {
        let result = "";
        const { username, name, email, url } = user;
        if (username) result += "username = ?";
        if (name) result += result ? ", name = ?" : "name = ?";
        if (email) result += result ? ", email = ?" : "email = ?";
        if (url) result += result ? ", url = ?" : "url = ?";
        return result;
      },
      valuesToUpdateUser: (user: UserForUpdate) => {
        const { username, name, email, url } = user;
        let result: string[] = [];
        username && result.push(username);
        name && result.push(name);
        email && result.push(email);
        url && result.push(url);
        return result;
      },
    };

    describe("All data exists", () => {
      const input = {
        username: "username",
        name: "name",
        email: "email",
        url: "url",
      };

      test("for loop", () => {
        const query = forLoop.queryToUpdateUser(input);
        const values = forLoop.valuesToUpdateUser(input);

        expect(query).toBe("username = ?, name = ?, email = ?, url = ?");
        expect(values).toEqual(["username", "name", "email", "url"]);
      });

      test("if", () => {
        const query = ifState.queryToUpdateUser(input);
        const values = ifState.valuesToUpdateUser(input);

        expect(query).toBe("username = ?, name = ?, email = ?, url = ?");
        expect(values).toEqual(["username", "name", "email", "url"]);
      });
    });

    describe("Most data does exist", () => {
      const input = {
        username: "",
        name: "name",
        email: "email",
        url: "url",
      };

      test("for loop", () => {
        const query = forLoop.queryToUpdateUser(input);
        const values = forLoop.valuesToUpdateUser(input);

        expect(query).toBe("name = ?, email = ?, url = ?");
        expect(values).toEqual(["name", "email", "url"]);
      });

      test("if", () => {
        const query = ifState.queryToUpdateUser(input);
        const values = ifState.valuesToUpdateUser(input);

        expect(query).toBe("name = ?, email = ?, url = ?");
        expect(values).toEqual(["name", "email", "url"]);
      });
    });

    describe("Few data does exist", () => {
      const input = {
        username: "",
        name: "name",
        email: "",
        url: "url",
      };

      test("for loop", () => {
        const query = forLoop.queryToUpdateUser(input);
        const values = forLoop.valuesToUpdateUser(input);

        expect(query).toBe("name = ?, url = ?");
        expect(values).toEqual(["name", "url"]);
      });

      test("if", () => {
        const query = ifState.queryToUpdateUser(input);
        const values = ifState.valuesToUpdateUser(input);

        expect(query).toBe("name = ?, url = ?");
        expect(values).toEqual(["name", "url"]);
      });
    });

    describe("First and last data doesn't exist", () => {
      const input = {
        username: "",
        name: "name",
        email: "email",
        url: "",
      };

      test("for loop", () => {
        const query = forLoop.queryToUpdateUser(input);
        const values = forLoop.valuesToUpdateUser(input);

        expect(query).toBe("name = ?, email = ?");
        expect(values).toEqual(["name", "email"]);
      });

      test("if", () => {
        const query = ifState.queryToUpdateUser(input);
        const values = ifState.valuesToUpdateUser(input);

        expect(query).toBe("name = ?, email = ?");
        expect(values).toEqual(["name", "email"]);
      });
    });

    describe("All data don't exist", () => {
      const input = {
        username: "",
        name: "",
        email: "",
        url: "",
      };

      test("for loop", () => {
        const query = forLoop.queryToUpdateUser(input);
        const values = forLoop.valuesToUpdateUser(input);

        expect(query).toBe("");
        expect(values).toEqual([]);
      });

      test("if", () => {
        const query = ifState.queryToUpdateUser(input);
        const values = ifState.valuesToUpdateUser(input);

        expect(query).toBe("");
        expect(values).toEqual([]);
      });
    });
  });
});
