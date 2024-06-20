import { db } from "@/db";
import {
  branchReference,
  division as divisionDB,
  hrimPositions,
  userDetails,
  users,
} from "@/db/schema/_pulled";
import {
  access,
  accessRights,
  loaManagement,
  queueReference,
} from "@/db/schema/fims";
import { format } from "date-fns";
import { and, eq, sql } from "drizzle-orm";
import { getUser } from "./auth";

export type Role = "approver" | "reviewer" | "requester";

export async function getRole1({
  id,
  total,
  divisionId,
  subModuleId,
}: {
  // id is the user id
  id: string;
  total?: number;
  divisionId?: number;
  subModuleId: number;
}) {
  const data = await db.query.loaManagement.findFirst({
    extras: {
      role: sql<Role>`CASE
              when ${id} = ${loaManagement.reviewer1Id} then 'reviewer'
              when ${id} = ${loaManagement.reviewer2Id} then 'reviewer'
              when ${id} = ${loaManagement.approver1Id} then 'approver'
              when ${id} = ${loaManagement.approver2Id} then 'approver'
              when ${id} = ${loaManagement.approver3Id} then 'approver'
              ELSE 'requester'
            END`.as("role"),
      order: sql<string>`CASE
            when ${id} = ${loaManagement.reviewer1Id} then '1'
            when ${id} = ${loaManagement.reviewer2Id} then '2'
            when ${id} = ${loaManagement.approver1Id} then '3'
            when ${id} = ${loaManagement.approver2Id} then '4'
            when ${id} = ${loaManagement.approver3Id} then '5'
            ELSE '0'
          END`.as("order"),
      approverCount: sql<number>`CASE
            when ${loaManagement.approver3Id} is not null then 3
            when ${loaManagement.approver2Id} is not null then 2
            when ${loaManagement.approver1Id} is not null then 1
            ELSE 0
          END`.as("approverCount"),
      reviewerCount: sql<number>`CASE
            when ${loaManagement.reviewer2Id} is not null then 2
            when ${loaManagement.reviewer1Id} is not null then 1
            ELSE 0
          END`.as("reviewerCount"),
    },
    where: (table, { inArray, and, eq, gte, lte }) =>
      and(
        inArray(sql`${id}`, [
          table.approver1Id,
          table.approver2Id,
          table.approver3Id,
          table.reviewer1Id,
          table.reviewer2Id,
        ]),
        eq(table.subModuleId, subModuleId),
        divisionId && total
          ? and(
              lte(table.minAmount, total),
              gte(table.maxAmount, total),
              eq(table.divisionId, divisionId),
            )
          : undefined,
      ),
  });

  const order = data?.order ? Number(data.order) : 0;
  const role = data?.role || "requester";
  const finalStatus =
    role === "requester" ? undefined : role === "approver" ? 3 : 0;
  const approverCount = data?.approverCount || 0;
  const reviewerCount = data?.reviewerCount || 0;
  return { role, order, finalStatus, approverCount, reviewerCount };
}

export async function getUserDetails(id: number) {
  const details = await db
    .select()
    .from(users)
    .leftJoin(userDetails, eq(users.id, userDetails.userId))
    .leftJoin(divisionDB, eq(users.divisionId, divisionDB.id))
    .leftJoin(hrimPositions, eq(userDetails.positionId, hrimPositions.id))
    .leftJoin(branchReference, eq(branchReference.id, userDetails.branchId))
    .where(eq(users.id, id));
  const {
    branch_reference: location,
    division,
    hrim_positions: position,
    user_details: detail,
    users: user,
  } = details[0];

  return { division, location, position, detail, user };
}

export async function hasAccess({ path }: { path: string }) {
  const userFromSession = await getUser();
  console.log({ userFromSession });
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, Number(userFromSession.id)),
  });
  if (!user) return false;
  if (user.levelId > 4) return true;
  const query = db
    .select()
    .from(accessRights)
    .leftJoin(access, eq(access.id, accessRights.accessId))
    .where(and(eq(accessRights.userId, user.id), eq(access.path, path)));
  console.log(query.toSQL());
  const res = await query;
  return res?.length > 0;
}

export function getStatusValues({
  order,
  finalStatus,
  approverCount,
  reviewerCount,
}: {
  order: number;
  finalStatus: number;
  approverCount: number;
  reviewerCount: number;
}) {
  const setValues = {
    reviewer1Status: order === 1 ? finalStatus : undefined,
    reviewer2Status:
      order === 2 || (reviewerCount === 1 && order === 1)
        ? finalStatus
        : undefined,
    approver1Status: order === 3 ? finalStatus : undefined,
    approver2Status:
      order === 4 || (approverCount === 1 && order === 3)
        ? finalStatus
        : undefined,
    approver3Status:
      order === 5 ||
      (approverCount === 2 && order === 4) ||
      (approverCount === 1 && order === 3)
        ? finalStatus
        : undefined,
  };
  return setValues;
}

export async function generateCodeFromDate({
  date = new Date(),
  prefix = "FLS",
}: {
  date?: Date;
  prefix?: string;
}): Promise<string> {
  const datePart = format(date, "MMddy");
  await db
    .insert(queueReference)
    .values({ datePart, prefix })
    .onDuplicateKeyUpdate({
      set: {
        number: sql<number>`${queueReference.number} + 1`,
      },
    });
  const queueData = await db.query.queueReference.findFirst({
    where: (table, { eq }) =>
      and(eq(table.prefix, prefix), eq(table.datePart, datePart)),
  });

  const queueNumber = queueData?.number || 1;

  // Concatenate the generated string with the date part
  const result = `${prefix}-${datePart}-${queueNumber
    .toString()
    .padStart(3, "0")}`;

  return result;
}

export async function getReviewersAndApprovers(
  total: number,
  subModuleId: number,
) {
  const data = await db.query.loaManagement.findFirst({
    where: (table, { eq, and, lte, gte }) =>
      and(
        eq(table.subModuleId, subModuleId),
        eq(table.status, 1),
        lte(table.minAmount, total),
        gte(table.maxAmount, total),
      ),
    with: {
      firstReviewer: true,
      secondReviewer: true,
      firstApprover: true,
      secondApprover: true,
      thirdApprover: true,
    },
  });

  if (!data) throw new Error("Loa Management not found!");

  return {
    reviewer1Id: data.firstReviewer?.id,
    reviewer2Id: data.secondReviewer?.id,
    approver1Id: data.firstApprover?.id,
    approver2Id: data.secondApprover?.id,
    approver3Id: data.thirdApprover?.id,
  };
}

export async function getPriorityLevel(startDate: Date) {
  const timeDifference = Math.abs(startDate.getTime() - new Date().getTime());
  const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  const priorityLevel = await db.query.priorityLevel.findFirst({
    where: (table, { gte }) => gte(table.daysMax, dayDifference),
    orderBy: (table, { asc }) => [asc(table.daysMax)],
  });
  if (!priorityLevel) return 4;
  return priorityLevel.id;
}

export async function getNextActionUser(
  approvers: Array<number | null>,
  isDeclined = false,
) {
  const user = await getUser();
  const currentUserOrder = approvers.indexOf(Number(user.id));
  const filteredApprovers = approvers.flatMap((approverId) =>
    approverId ? [approverId] : [],
  );
  const index = currentUserOrder + 1;
  const nextActionUserId =
    filteredApprovers.length > index ? filteredApprovers[index] : null;
  return isDeclined ? Number(user.id) : nextActionUserId;
}

export function constructFullName({
  userDetails: u,
  withComma = false,
  fallbackName,
}: {
  withComma?: boolean;
  userDetails: typeof userDetails.$inferSelect;
  fallbackName: string;
}) {
  if (!u?.firstName || !u?.lastName) return fallbackName;
  const { firstName, middleName, lastName } = u;
  const withoutCommaFormat = `${firstName} ${
    middleName ? `${middleName} ` : ""
  }${lastName}`;
  const withCommaFormat = `${lastName}, ${firstName} ${
    middleName ? `${middleName} ` : ""
  }`;
  return withComma ? withCommaFormat : withoutCommaFormat;
}
