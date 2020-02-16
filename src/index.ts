import program from "./App/Main"
import * as E from "fp-ts/lib/Either"
import { APIGatewayProxyHandler } from "aws-lambda"
import { identity } from "fp-ts/lib/function"
import { createUserDao } from "./Db"
import { pipe } from "fp-ts/lib/pipeable"
import { ctorBase } from "./App/Error"

export const handler: APIGatewayProxyHandler = async (event) => {
  const result = await program({
    eventQueryString: event.queryStringParameters
  })({
    daos: {
      user: createUserDao("db instance")
    },
    stageVariables: "DEV"
  })()

  const proxyResult = pipe(
    result,
    E.chain(users =>
      E.stringifyJSON(users, _ => ctorBase({ _tag: "DbError", status_message: "stringify failed" }))
    ),
    E.bimap(
      err => ({
        statusCode: 500,
        body: err.status_message
      }),
      content => ({
        statusCode: 200,
        body: content
      })
    ),
    E.fold(
      identity,
      identity
    )
  )

  return proxyResult
}