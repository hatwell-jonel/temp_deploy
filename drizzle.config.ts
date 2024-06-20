import { env } from "@/env.mjs";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/fims/index.ts",
  driver: "mysql2",
  out: "./src/db",
  dbCredentials: {
    uri: env.DATABASE_URL,
  },
  tablesFilter: ["fims_*"],
  verbose: true,
  strict: true,
});
