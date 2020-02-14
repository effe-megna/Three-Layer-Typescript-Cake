import program from "./App/Main"
import { Env } from "./App/Env"
import { User } from "./Core"
import * as E from "fp-ts/lib/Either"
import { identity } from "io-ts"

describe("program", () => {
  const user: User = {
    email: "gg@gmail.com",
    emailVerified: true,
    group: "ADMIN",
    id: "x-1-a",
    name: "giame"
  }

  const env: Env = {
    daos: {
      user: {
        getUserByEmail: (email) => Promise.resolve(user),
        getUsers: () => Promise.resolve([
          user,
          user
        ])
      }
    },
    stageVariables: "DEV"
  }

  test("run program with null queryString should respond with statusCode 200", async () => {
    const result = await program({
      eventQueryString: null
    })(env)()
      .then(E.fold(identity, identity))

    expect(result.statusCode).toBe(200)
  })

  test("run program with invalid queryString should respond with statusCode 500 and QueryStringInvalid in metadata", async () => {
    const result = await program({
      eventQueryString: { group: "@" }
    })(env)()
      .then(E.fold(identity, identity))
    
    expect(result.statusCode).toBe(500)
    expect(JSON.parse(result.body)._tag).toBe("QueryStringInvalid")
  })

})