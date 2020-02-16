import * as R from "fp-ts/lib/Reader"
import * as RTE from "fp-ts/lib/ReaderTaskEither"
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
    RTE.ask<Env>(),
    RTE.chain(env =>
      RTE.fromTaskEither(
        TE.tryCatch(
          () => env.daos.user.getUsers(),
          _ => ctorBase({ _tag: "DbError", status_message: "generic error" })
        )
      ),
    ),
    RTE.map(users => 
      pipe(
        qs,
        O.fold(
          () => users,
          qs => filterByQuery(users, qs)
        )
      )  
    )
  )