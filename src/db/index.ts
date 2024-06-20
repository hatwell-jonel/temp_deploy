import { env } from "@/env.mjs";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as pulled from "./schema/_pulled";
import * as pulledRelations from "./schema/_pulledRelations";
import * as fims from "./schema/fims";
import * as relations from "./schema/relations";

export const schema = { ...pulled, ...pulledRelations, ...fims, ...relations };

export { capexTable as tableCreator } from "./schema/_table";

// Create the connection
// const connection = connect({
//   url: env.DATABASE_URL,
// });

const globalPool: mysql.Pool | undefined = undefined;

function connect() {
  if (typeof globalPool !== "undefined") {
    return globalPool;
  }
  return mysql.createPool({
    uri: env.DATABASE_URL,
  });
}

export const db = drizzle(connect(), {
  schema,
  mode: "default",
  // logger: process.env.NODE_ENV === "development",
});
