import * as R from "fp-ts/lib/Reader"
import { UserDao } from "../Db";
import { pipe } from "fp-ts/lib/pipeable";

export type Env = {
  daos: {
    user: UserDao
  },
  stageVariables: "DEV" | "STAGING" | "PRODUCTION"
}

type WithDaos = {
  daos: {
    user: UserDao
  }
}

type WithStaveVariables = {
  stageVariables: "DEV" | "STAGING" | "PRODUCTION" 
}

type WithAWS = {
  lambdaAlias: string,
  arn: string
}

type _Env <A> = R.Reader<WithStaveVariables & WithAWS, A>


const a = (): _Env<string> => (env) => {
  return "hello, world!"
}

const b = (): R.Reader<WithAWS, string> => {
  return (aws) => "ggwp"
}

const c = (): R.Reader<WithStaveVariables, number> => {
  return (daos) => 3
}

const main = () => {
  const cc = pipe(
    a(),
    R.map(c),
    R.flatten,
    R.map(b),
    R.flatten
  )

  return cc({
    arn: "arn",
    lambdaAlias: "33",
    stageVariables: "DEV"
  })
}

console.log(
  main()
)