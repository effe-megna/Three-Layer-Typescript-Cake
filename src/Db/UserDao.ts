import { User } from "../Core"
import * as TE from "fp-ts/lib/TaskEither"
import * as O from "fp-ts/lib/Option"
import { DbError } from "../App/Error"

type CreateUserDao = (db: any) => UserDao

export type UserDao = {
  getUserByEmail: (email: string) => TE.TaskEither<DbError, O.Option<User>>
  getUsers: () => TE.TaskEither<DbError, User[]>
}

export const createUserDao: CreateUserDao = (
  db
) => {
  return {
    getUsers: () => TE.right(usersFixture),
    getUserByEmail: (email) => {
      return TE.right(O.some({
        email: email,
        id: '123',
        name: "123",
        emailVerified: true,
        group: "ADMIN"
      }))
    }
  }
}

const usersFixture: User[] = [
  { email: "1@gmail", id: '1', name: "f", emailVerified: true, group: "ADMIN" },
  { email: "2@gmail", id: '2', name: "a", emailVerified: true, group: "B2C" },
  { email: "3@gmail", id: '3', name: "b", emailVerified: true, group: "ADMIN" },
  { email: "4@gmail", id: '4', name: "c", emailVerified: true, group: "B2C" },
  { email: "5@gmail", id: '5', name: "d", emailVerified: true, group: "CS" },
  { email: "6@gmail", id: '6', name: "e", emailVerified: true, group: "B2B" }
]