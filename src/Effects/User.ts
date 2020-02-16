import * as R from "fp-ts/lib/Reader"
import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as O from "fp-ts/lib/Option"
import { Env } from "../App/Env"
import * as Decoders from "../Decoders"
import { pipe } from "fp-ts/lib/pipeable"
import { User, filterByQuery } from "../Core"
import { Context } from "../App/Main"

export const getUsers = (qs: O.Option<Decoders.QueryString>): Context<User[]> =>
  pipe(
    RTE.ask<Env>(),
    RTE.chain(env => env.daos.user.getUsers),
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