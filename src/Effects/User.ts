import * as R from "fp-ts/lib/Reader"
import * as TE from "fp-ts/lib/TaskEither"
import * as O from "fp-ts/lib/Option"
import { Env } from "../App/Env"
import * as Decoders from "../Decoders"
import { pipe } from "fp-ts/lib/pipeable"
import { User, filterByQuery } from "../Core"
import { ctorBase } from "../App/Error"
import { Context } from "../App/Main"

export const getUsers = (qs: O.Option<Decoders.QueryString>): Context<User[]> =>
  pipe(
    qs,
    O.fold(
      getAllUsers,
      filterUsersByQueryString
    )
  )

const getAllUsers = (): Context<User[]> => pipe(
  R.ask<Env>(),
  R.map(({ daos: { user } }) =>
    TE.tryCatch(
      () => user.getUsers(),
      _ => ctorBase({ _tag: "DbError", status_message: "generic error" })
    )
  )
)

const filterUsersByQueryString = (qs: Decoders.QueryString): Context<User[]> => pipe(
  R.ask<Env>(),
  R.map(({ daos: { user } }) =>
    pipe(
      TE.tryCatch(
        () => user.getUsers(),
        _ => ctorBase({ _tag: "DbError", status_message: "generic" })
      ),
      TE.map(users => filterByQuery(users, qs))
    )
  )
)