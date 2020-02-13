import * as t from "io-ts"

type Patched<A0, O0, T> = T extends t.ExactType<infer B, any, any, infer I>
  ? { type: t.Type<A0, O0, I> } & t.ExactType<B, A0, O0, I>
  : T extends t.Type<any, any, infer I>
  ? t.Type<A0, O0, I>
  : never;
​
export function AsOpaque<A0, O0 = A0>(): <
  A extends A0,
  O extends O0,
  T extends t.Type<A, O>
>(
  toO: T
) => Patched<A0, O0, T> {
  return toO => toO as any;
}

export * from "./QueryString"