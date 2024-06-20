import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    UPLOADTHING_SECRET: z.string().startsWith("sk_live"),
    SLACK_WEBHOOK_URL: z.string().url().optional(),
    CIS_API: z.string().url().endsWith("/api"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    CIS_API: process.env.CIS_API,
  },
});
