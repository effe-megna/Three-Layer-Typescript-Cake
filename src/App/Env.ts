import { UserDao } from "../Db";

export type Env = {
  daos: {
    user: UserDao
  },
  stageVariables: "DEV" | "STAGING" | "PRODUCTION"
}