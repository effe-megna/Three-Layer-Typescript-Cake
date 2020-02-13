/**
 * Your real business logic might be fancier, but basically this is the most common case

 *  Something to ask
 *  Something to write
 *  Some effects on dependencies
 *  Some error to handle
 *  Some business computation
*/

/**
 * Three layer typescript cake
 * 
 * Layer 1:
 *  Main
 * Layer 2:
 *  Dependencies
 * Layer 3:
 *  Business Logic
 */

import * as R from "fp-ts/lib/Reader"

type User = {
  id: string
  name: string
  isActive: boolean
}

type UserDao = {
  getUserById: (id: string) => Promise<User>
  getUsers: () => Promise<User[]>
}

type Env = {
  userDao: UserDao
  stageVariables: "DEV" | "STAGING" | "PRODUCTION"
}

type Context <A> = R.Reader<Env, A>



// Pure

const findActiveUsers = (us: User[]): User[] => {
  return us.filter(u => u.isActive)
}

const findUserById = (id: string, us: User[]): User | undefined => {
  return us.find(u => u.id === id)
}



// 