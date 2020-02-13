type WithTag <A, T extends String> = A & { _tag: T }

type Base = {
  status_message: string,
  timestamp: string
}

export type Error = 
  | DbError
  | UserNotFound
  | EmailDoesNotExist
  | QueryStringInvalid


export type DbError = WithTag<Base, "DbError">

export type UserNotFound = WithTag<Base, "UserNotFound">

export type EmailDoesNotExist = WithTag<Base, "EmailDoesNotExists">

export type QueryStringInvalid = WithTag<Base, "QueryStringInvalid">

export const ctorBase = (err: Omit<Error, "timestamp">): Error => {

  //@ts-ignore
  const error: Error = {
    timestamp: new Date().toISOString(),
    ...err
  }

  return error
}