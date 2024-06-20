import { db } from "@/db";

export async function getCATypes() {
  const data = await db.query.cashAdvanceType.findMany();
  return data;
}
