import program from "./App/Main"
import * as E from "fp-ts/lib/Either"
import { APIGatewayProxyHandler } from "aws-lambda"
import { identity } from "fp-ts/lib/function"
import { createUserDao } from "./Db"

export const handler: APIGatewayProxyHandler = async (event) => {
  const result = program({
    eventQueryString: event.queryStringParameters
  })({
    daos: {
      user: createUserDao("db instance")
    },
    stageVariables: "DEV"
  })()

  return result.then(E.fold(identity, identity))
}