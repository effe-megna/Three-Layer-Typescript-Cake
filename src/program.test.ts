import program from "./App/Main"
import { Env } from "./App/Env"
import { User } from "./Core"
import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import * as O from "fp-ts/lib/Option"
import { Error } from "./App/Error"

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
        getUserByEmail: (email) => TE.right(O.some(user)),
        getUsers: () => TE.right([
          user,
          user
        ])
      }
    },
    stageVariables: "DEV"
  }

  test("run program without queryString, should respond with all users", async () => {
    const result = await program({
      eventQueryString: null
    })(env)()

    expect(result).toMatchObject<E.Either<Error, User[]>>(
      {
        _tag: "Right",
        right: [
          user,
          user
        ]
      }
    )
  })

  test("run program with queryString, filtering by email, should given the exact user", async () => {
    const martina: User = { 
      name: "martina", 
      group: "B2C", 
      email: "martina.33@gmail.com", 
      emailVerified: true, 
      id: "44" 
    }
    
    const result = await program({
      eventQueryString: { email: "martina" }
    })({
      ...env,
      daos: {
        ...env.daos,
        user: {
          ...env.daos.user,
          getUsers: () => TE.right([martina])
        }
      }
    })()

    expect(result).toMatchObject<E.Either<Error, User[]>>(
      {
        _tag: "Right",
        right: [
          martina
        ]
      }
    )
  })

})