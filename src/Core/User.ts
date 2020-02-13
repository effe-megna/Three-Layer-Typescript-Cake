import { QueryString } from "../Decoders/QueryString"

export type User = {
  id: string
  email: string
  emailVerified: boolean
  name: string
  group: "B2C" | "B2B" | "CS" | "ADMIN"
}

export const filterByQuery = (users: User[], qs: QueryString): User[] =>
  users.filter(user => user.email.startsWith(user.email) && user.group === qs.group)