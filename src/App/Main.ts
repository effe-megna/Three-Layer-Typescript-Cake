import * as R from "fp-ts/lib/Reader"
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { Env } from "./Env"
import * as Decoders from "../Decoders"
import { pipe } from "fp-ts/lib/pipeable"
import { User } from "../Core"
import { createUserDao } from "../Db"
import { QueryStringInvalid } from "./Error"

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

type Context<A> = R.Reader<Env, A>

const handler: APIGatewayProxyHandler = async (event) => {
  
  const users = pipe(
    Decoders.parseQueryString(event.queryStringParameters),
    getUsers,
    E.map(ctx => ctx({
      daos: {
        user: createUserDao("")
      },
      stageVariables: "DEV"
    }))
  )
  
  const proxyResult: APIGatewayProxyResult = await pipe(
    users,
    E.fold(
      error => Promise.resolve(({
        statusCode: 500,
        body: JSON.stringify(error)
      })),
      userPromise => userPromise.then(users => ({
        statusCode: 200,
        body: JSON.stringify(users)
      }))
    )
  )


  return proxyResult
}

const getUsers = (queryStringEither: E.Either<QueryStringInvalid, O.Option<Decoders.QueryString>>): E.Either<QueryStringInvalid, Context<Promise<User[]>>> => pipe(
  queryStringEither,
  E.map(optionQstr => 
    pipe(
      optionQstr,
      O.fold(
        getAllUsers,
        filterUsersByQueryString
      )
    )
  )
)

const getAllUsers = (): Context<Promise<User[]>> => pipe(
  R.ask<Env>(),
  R.map(({ daos: { user } }) => user.getUsers())
)

const filterUsersByQueryString = (qs: Decoders.QueryString): Context<Promise<User[]>> => pipe(
  R.ask<Env>(),
  R.map(async ({ daos: { user } }) => {
    const allUsers = await user.getUsers()

    return allUsers.filter(user => user.email.startsWith(user.email) && user.group === qs.group)
  })
)