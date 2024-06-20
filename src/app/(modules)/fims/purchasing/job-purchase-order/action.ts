"use server";

import { db } from "@/db";
import { order, purchasing, rfp, rfpParticulars } from "@/db/schema/fims";
import {
  generateCodeFromDate,
  getNextActionUser,
  getReviewersAndApprovers,
} from "@/lib/helpers";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type State = {
  message: string | undefined;
  success: boolean | undefined;
};

async function insertRFP({
  referenceNo,
  type,
}: {
  type: "po" | "jo";
  referenceNo: string;
}) {
  await db.transaction(async (tx) => {
    const orderData = await tx.query.order.findFirst({
      where: (table, { eq }) => eq(table.orderNo, referenceNo),
    });
    if (!orderData) throw new Error("Cannot find order.");
    const { purchasingId } = orderData;
    const canvassingData = await tx.query.canvassing.findFirst({
      where: (table, { eq }) => eq(table.purchasingId, purchasingId),
    });
    if (!canvassingData) throw new Error("Cannot find canvassing.");
    const { canvasRequestNo } = canvassingData;

    if (type === "po") {
      const poData = await tx.query.canvasPurchase.findMany({
        where: (table, { eq }) => eq(table.canvasRequestNo, canvasRequestNo),
        with: {
          itemDescription: {
            with: {
              itemCategory: true,
            },
          },
          supplier: true,
        },
      });
      if (poData.length === 0)
        throw new Error("Cannot find Reference Number in Canvas Request PR.");

      const total = poData.reduce(
        (acc, obj) => acc + obj.quantity * obj.unitPrice,
        0,
      );

      const {
        opexCategoryId,
        budgetSourceId,
        chartOfAccountsId,
        subAccountsId,
      } = poData[0].itemDescription.itemCategory;

      const reviewersAndApprovers = await getReviewersAndApprovers(total, 5);
      const rfpNo = await generateCodeFromDate({ prefix: "FLS-RFP" });

      const rfpValues: typeof rfp.$inferInsert = {
        rfpNo,
        purchasingId: orderData.purchasingId,
        dateNeeded: orderData.expectedEndDate,
        transactionDateFrom: poData[0].createdAt || new Date(),
        transactionDateTo: poData[0].deliveryDate,
        dueDate: orderData.expectedEndDate,
        priorityLevelId: Number(orderData.priorityLevelId),
        payeeId: Number(poData[0].supplierId),
        requestorId: orderData.createdBy,
        tin: poData[0].supplier.tin,
        budgetSourceId: Number(budgetSourceId),
        opexCategoryId: Number(opexCategoryId),
        chartOfAccountId: Number(chartOfAccountsId),
        subAccountId: Number(subAccountsId),
        requestedBy: orderData.createdBy,
        poNumber: orderData.orderNo,
        amount: total,
        ...reviewersAndApprovers,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
        nextAction: 1,
        createdBy: orderData.createdBy,
      };

      await tx.insert(rfp).values(rfpValues);

      const rfpParticularValues: Array<typeof rfpParticulars.$inferInsert> =
        poData.map((po) => ({
          rfpNo,
          description: po.itemDescription.description,
          amount: po.unitPrice,
          quantity: po.quantity,
        }));

      await tx.insert(rfpParticulars).values(rfpParticularValues);
    } else if (type === "jo") {
      const joData = await tx.query.canvasService.findMany({
        where: (table, { eq }) => eq(table.canvasRequestNo, canvasRequestNo),
        with: {
          serviceDescription: {
            with: {
              serviceCategory: true,
            },
          },
          worker: true,
        },
      });
      if (!joData)
        throw new Error("Cannot find Reference Number in Canvas Request PR.");

      const {
        opexCategoryId,
        budgetSourceId,
        chartOfAccountsId,
        subAccountsId,
      } = joData[0].serviceDescription.serviceCategory;
      const total = joData.reduce((acc, obj) => acc + obj.rate * obj.hours, 0);
      const rfpNo = await generateCodeFromDate({ prefix: "FLS-RFP" });
      const reviewersAndApprovers = await getReviewersAndApprovers(total, 5);

      const rfpValues: typeof rfp.$inferInsert = {
        rfpNo,
        purchasingId: orderData.purchasingId,
        dateNeeded: orderData.expectedEndDate,
        transactionDateFrom: joData[0].startDate,
        transactionDateTo: joData[0].endDate,
        dueDate: orderData.expectedEndDate,
        priorityLevelId: Number(orderData.priorityLevelId),
        payeeId: orderData.createdBy,
        requestorId: orderData.createdBy,
        budgetSourceId: Number(budgetSourceId),
        opexCategoryId: Number(opexCategoryId),
        chartOfAccountId: Number(chartOfAccountsId),
        subAccountId: Number(subAccountsId),
        requestedBy: orderData.createdBy,
        tin: joData[0].worker.tin,
        joNumber: orderData.orderNo,
        amount: total,
        ...reviewersAndApprovers,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
        nextAction: 1,
        createdBy: orderData.createdBy,
      };
      await tx.insert(rfp).values(rfpValues);

      const rfpParticularValues: Array<typeof rfpParticulars.$inferInsert> =
        joData.map((jo) => ({
          rfpNo,
          description: jo.serviceDescription.description,
          amount: jo.rate,
          quantity: jo.hours,
        }));

      await tx.insert(rfpParticulars).values(rfpParticularValues);
    }
  });
}

async function changeStatus(
  status: number,
  referenceNo: string,
  type: "jo" | "po",
) {
  console.log("Starting transaction...");
  await db.transaction(async (tx) => {
    const o = await tx.query.order.findFirst({
      where: (table, { eq, and }) => and(eq(table.orderNo, referenceNo)),
    });

    if (!o) throw new Error("Order not found!");

    const setValues = {
      approver1Status: o.approver1Id ? status : o.approver1Status,
      approver2Status:
        (o.approver2Status === 0 && o.approver1Status === 1) ||
        (o.approver1Status === 0 && o.approver2Id === null)
          ? status
          : o.approver2Status,
      approver3Status:
        (o.approver3Status === 0 &&
          o.approver2Status === 1 &&
          o.approver1Status === 1) ||
        (o.approver2Status === 0 && o.approver3Id === null)
          ? status
          : o.approver3Status,
    };

    const approverStatuses = [
      setValues.approver1Status,
      setValues.approver2Status,
      setValues.approver3Status,
    ];

    const finalStatus = approverStatuses.every((status) => status === 1)
      ? 1
      : approverStatuses.some((status) => status === 2)
        ? 2
        : undefined;

    const approvers = [o.approver1Id, o.approver2Id, o.approver3Id];

    const isDeclined = finalStatus === 2;
    const nextActionUserId = await getNextActionUser(approvers, isDeclined);
    console.log({ nextActionUserId, isDeclined, finalStatus });

    await tx
      .update(order)
      .set({
        ...setValues,
        nextActionUserId,
        finalStatus,
        nextAction: finalStatus === 1 ? 4 : finalStatus === 2 ? 2 : 1,
      })
      .where(and(eq(order.orderNo, referenceNo)));

    if (finalStatus) {
      console.log("Updating purchasing...");
      await tx
        .update(purchasing)
        .set({ orderFinalStatus: finalStatus })
        .where(eq(purchasing.id, o.purchasingId));
      if (finalStatus === 1) {
        console.log("Inserting rfp...");
        await insertRFP({
          referenceNo,
          type,
        });
      }
    }
  });

  const pathToRevalidate = `/fims/purchasing/job-purchase-order/${
    type === "po" ? "purchase" : "(service)"
  }`;
  revalidatePath(pathToRevalidate, "layout");
}

export async function declinePO(
  referenceNo: string,
  state: State,
  formData: FormData,
): Promise<State> {
  try {
    await changeStatus(2, referenceNo, "po");
    return {
      message: "Purchase Order has been declined!",
      success: true,
    };
  } catch (error) {
    if (error instanceof Error)
      return { success: false, message: error.message };
    return { success: false, message: "Something went wrong." };
  }
}

export async function declineJO(
  referenceNo: string,
  state: State,
  formData: FormData,
): Promise<State> {
  try {
    await changeStatus(2, referenceNo, "jo");
    return {
      message: "Job Order has been declined!",
      success: true,
    };
  } catch (error) {
    if (error instanceof Error)
      return { success: false, message: error.message };
    return { success: false, message: "Something went wrong." };
  }
}

export async function approveJO(
  referenceNo: string,
  state: State,
  formData: FormData,
): Promise<State> {
  try {
    await changeStatus(1, referenceNo, "jo");
    return {
      message: "Job Order has been approved!",
      success: true,
    };
  } catch (error) {
    if (error instanceof Error)
      return { success: false, message: error.message };
    return { success: false, message: "Something went wrong." };
  }
}

export async function approvePO(
  referenceNo: string,
  state: State,
  formData: FormData,
): Promise<State> {
  try {
    await changeStatus(1, referenceNo, "po");
    return {
      message: "Purchase Order has been approved!",
      success: true,
    };
  } catch (error) {
    if (error instanceof Error)
      return { success: false, message: error.message };
    return { success: false, message: "Something went wrong." };
  }
}
