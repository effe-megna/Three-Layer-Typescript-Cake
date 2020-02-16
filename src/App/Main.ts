import * as RTE from "fp-ts/lib/ReaderTaskEither"
import { Env } from "./Env"
import * as Decoders from "../Decoders"
import { pipe } from "fp-ts/lib/pipeable"
import { Error } from "./Error"

import * as Effects from "../Effects"
import { User } from "../Core"

/**
 * Your real business logic might be fancier, but basically this is the most common case

 *  Something to ask
 *  Something to write
 *  Some effects on dependencies
 *  Some error to handle
 *  Some business computation
*/

/**
 * Use case
 *  get all user filtered by email and group (optionals) or return all users
 */

export type Context<A> = RTE.ReaderTaskEither<Env, Error, A>

type Program = (props: {
  eventQueryString: Record<string, string> | null
}) => RTE.ReaderTaskEither<Env, Error, User[]>

const program: Program = ({
  eventQueryString
}) => pipe(
  RTE.fromEither(Decoders.parseQueryString(eventQueryString)),
  RTE.chain(Effects.getUsers)
)

export default program