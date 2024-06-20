import { env } from "@/env.mjs";
import type { User } from "next-auth";

export async function notify(text: string) {
  if (env.SLACK_WEBHOOK_URL) {
    const res = await fetch(env.SLACK_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
    });
  }
}

export async function notifyRequisition({
  requisitionNo,
  status,
  user,
  subModule,
}: { requisitionNo: string; status: string; user: User; subModule: string }) {
  if (env.SLACK_WEBHOOK_URL) {
    const res = await fetch(env.SLACK_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Requisition No: ${requisitionNo} has been ${status}.\n\nCreator: <mailto:${user.email}|${user.name}>\n\n Sub module: ${subModule}`,
            },
          },
        ],
      }),
    });
  }
}
