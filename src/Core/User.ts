
export type User = {
  id: string
  email: string
  emailVerified: boolean
  name: string
  group: "B2C" | "B2B" | "CS" | "ADMIN"
}

export const getVerifiedUser = (users: User[]): User[] => 
  users.filter(user => user.emailVerified === true)

export const getUnverifiedUser = (users: User[]): User[] =>
  users.filter(user => user.emailVerified === false)