import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as E from "fp-ts/lib/Either"
import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { Env } from "./Env"
import * as Decoders from "../Decoders"
import { pipe } from "fp-ts/lib/pipeable"
import { createUserDao } from "../Db"
import { Error } from "./Error"
import { identity } from "fp-ts/lib/function"

import * as Effects from "../Effects"

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
  eventQueryString: Record<string, any> | null
}) => RTE.ReaderTaskEither<Env, APIGatewayProxyResult, APIGatewayProxyResult>

const program: Program = ({
  eventQueryString
}) => pipe(
  RTE.fromEither(Decoders.parseQueryString(eventQueryString)),
  RTE.chain(Effects.getUsers),
  RTE.map(users => JSON.stringify(users)),
  RTE.map(usersStringified => ({
    statusCode: 200,
    body: usersStringified
  })),
  RTE.mapLeft(err => ({
    statusCode: 500,
    body: JSON.stringify(err)
  }))
)

export default program

export const handler: APIGatewayProxyHandler = async (event) => {
  const program = pipe(
    RTE.fromEither(Decoders.parseQueryString(event.queryStringParameters)),
    RTE.chain(Effects.getUsers),
    RTE.map(users => JSON.stringify(users)),
    RTE.map(usersStringified => ({
      statusCode: 200,
      body: usersStringified
    })),
    RTE.mapLeft(err => ({
      statusCode: 500,
      body: JSON.stringify(err)
    }))
  )

  const result = program({
    daos: {
      user: createUserDao("")
    },
    stageVariables: "DEV"
  })()

  return result.then(E.fold(identity, identity))
}