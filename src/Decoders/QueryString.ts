import { pipe } from "fp-ts/lib/pipeable"
import * as t from "io-ts"
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import { QueryStringInvalid, ctorBase } from "../App/Error"
import { AsOpaque } from "."

export type QueryString = t.TypeOf<typeof QueryStringIO>

const QueryStringIO_ = t.type({
  group: t.union([
    t.keyof({
      B2C: null,
      B2B: null,
      CS: null,
      ADMIN: null,
    }), 
    t.null, 
    t.undefined
  ]),
  email: t.union([t.string, t.undefined, t.null])
})

interface QueryStringIO extends t.TypeOf<typeof QueryStringIO_> { }
interface QueryStringIOO extends t.OutputOf<typeof QueryStringIO_> { }

const QueryStringIO = AsOpaque<QueryStringIO, QueryStringIOO>()(QueryStringIO_)

export const parseQueryString = (qstr: Record<string, any> | null): E.Either<QueryStringInvalid, O.Option<QueryString>> => {
  if (qstr === null || qstr === undefined) {
    return E.right(O.none)
  }

  return pipe(
    qstr,
    QueryStringIO.decode,
    E.bimap(
      (_) => ctorBase({ _tag: "QueryStringInvalid", status_message: "query string error" }) as QueryStringInvalid,
      O.some
    )
  )
}