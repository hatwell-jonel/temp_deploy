import { fimsTable } from "@/db/schema/_table";
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  float,
  index,
  int,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const purchasing = fimsTable(
  "purchasing",
  {
    id: serial("id").primaryKey(),

    requisitionFinalStatus: int("requisition_final_status").default(0),
    canvassingFinalStatus: int("canvassing_final_status").default(0),
    requestFinalStatus: int("request_final_status").default(0),
    orderFinalStatus: int("order_final_status").default(0),
    rfpFinalStatus: int("rfp_final_status").default(0),
    checkVoucherFinalStatus: int("check_voucher_final_status").default(0),

    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    requisitionStatusIdx: index("requisition_status_idx").on(
      table.requisitionFinalStatus,
    ),
    canvassingFinalStatusIdx: index("canvassing_final_status_idx").on(
      table.canvassingFinalStatus,
    ),
    requestFinalStatusIdx: index("request_final_status_idx").on(
      table.requestFinalStatus,
    ),
    orderFinalStatusIdx: index("order_final_status_idx").on(
      table.orderFinalStatus,
    ),
    rfpFinalStatusIdx: index("rfp_final_status_idx").on(table.rfpFinalStatus),
    checkVoucherFinalStatusIdx: index("check_voucher_final_status_idx").on(
      table.checkVoucherFinalStatus,
    ),
  }),
);

export const requisition = fimsTable(
  "requisition",
  {
    id: serial("id").primaryKey(),
    purchasingId: bigint("purchasing_id", { mode: "number" }).notNull(),
    requisitionNo: varchar("requisition_no", { length: 255 })
      .notNull()
      .unique(),
    priorityLevelId: bigint("priority_level_id", { mode: "number" }).notNull(),
    requisitionTypeId: bigint("requisition_type_id", {
      mode: "number",
    }).notNull(),
    expectedStartDate: timestamp("expected_start_date").notNull(),
    expectedEndDate: timestamp("expected_end_date").notNull(),
    finalStatus: int("final_status").default(0),
    approver1Id: bigint("approver1_id", { mode: "number" }).notNull(),
    approver2Id: bigint("approver2_id", { mode: "number" }),
    approver3Id: bigint("approver3_id", { mode: "number" }),
    reviewer1Id: bigint("reviewer1_id", { mode: "number" }),
    reviewer2Id: bigint("reviewer2_id", { mode: "number" }),
    approver1Status: int("approver1_status").default(0),
    approver2Status: int("approver2_status").default(0),
    approver3Status: int("approver3_status").default(0),
    reviewer1Status: int("reviewer1_status").default(0),
    reviewer2Status: int("reviewer2_status").default(0),
    approver1StatusDate: timestamp("approver1_status_date"),
    approver2StatusDate: timestamp("approver2_status_date"),
    approver3StatusDate: timestamp("approver3_status_date"),
    reviewer1StatusDate: timestamp("reviewer1_status_date"),
    reviewer2StatusDate: timestamp("reviewer2_status_date"),
    hasCanvassing: boolean("has_canvassing").default(false),
    nextActionUserId: bigint("next_action_user_id", { mode: "number" }),
    nextAction: int("next_action").notNull().default(3),
    createdBy: bigint("created_by", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      createdByIdx: index("created_by_idx").on(table.createdBy),
      priorityLevelIdx: index("priority_level_idx").on(table.priorityLevelId),
      requisitionTypeIdx: index("requisition_type_idx").on(
        table.requisitionTypeId,
      ),
    };
  },
);

export const serviceRequisition = fimsTable(
  "service_requisition",
  {
    id: serial("id").primaryKey(),
    requisitionNo: varchar("requisition_no", { length: 255 })
      .notNull()
      .unique(),
    serviceCategoryId: bigint("service_category_id", {
      mode: "number",
    }).notNull(),
    serviceDescriptionId: bigint("service_description_id", {
      mode: "number",
    }).notNull(),
    numberOfWorkers: int("number_of_workers").notNull(),
    manHours: int("man_hours").notNull(),
    estimatedRate: float("estimated_rate").notNull(),
    preferredWorkerId: bigint("preferred_worker_id", {
      mode: "number",
    }),
    purposeId: bigint("purpose_id", {
      mode: "number",
    }),
    locationId: bigint("location_id", {
      mode: "number",
    }).notNull(),
    rejectionId: bigint("rejection_id", { mode: "number" }),
    comments: varchar("comments", { length: 255 }),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    rejectionIdx: index("rejection_idx").on(table.rejectionId),
    locationIdx: index("location_idx").on(table.locationId),
    purposeIdx: index("purpose_idx").on(table.purposeId),
    preferredWorkerIdx: index("preferred_worker_idx").on(
      table.preferredWorkerId,
    ),
    serviceCategoryIdx: index("service_category_idx").on(
      table.serviceCategoryId,
    ),
    serviceDescriptionIdx: index("service_description_idx").on(
      table.serviceDescriptionId,
    ),
    requisitionNoIdx: index("requisition_no_idx").on(table.requisitionNo),
  }),
);

export const serviceRequisitionAttachments = fimsTable(
  "service_requisition_attachments",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    serviceRequisitionId: bigint("service_requisition_id", {
      mode: "number",
    }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
);

export const purchase = fimsTable(
  "purchase_requisition",
  {
    id: serial("id").primaryKey(),
    requisitionNo: varchar("requisition_no", { length: 255 }).notNull(),
    itemCategoryId: bigint("item_category_id", {
      mode: "number",
    }).notNull(),
    itemDescriptionId: bigint("item_description_id", {
      mode: "number",
    }).notNull(),
    quantity: int("quantity").notNull(),
    unitId: bigint("unit_id", { mode: "number" }).notNull(),
    estimatedPrice: float("estimated_price").notNull(),
    estimatedTotal: float("estimated_total").notNull(),
    purposeId: bigint("purpose_id", {
      mode: "number",
    }),
    beneficialBranchId: bigint("beneficial_branch_id", {
      mode: "number",
    }).notNull(),
    preferredSupplierId: bigint("preferred_supplier_id", {
      mode: "number",
    }),
    rejectionId: bigint("rejection_id", { mode: "number" }),
    remarks: varchar("remarks", { length: 255 }),
    isSampleProduct: boolean("is_sample_product").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    itemCategoryId: index("item_category_idx").on(table.itemCategoryId),
    itemDescriptionId: index("item_description_idx").on(
      table.itemDescriptionId,
    ),
    beneficialBranchId: index("beneficial_branch_idx").on(
      table.beneficialBranchId,
    ),
    preferredSupplierId: index("preferred_supplier_idx").on(
      table.preferredSupplierId,
    ),
    rejectionId: index("rejection_idx").on(table.rejectionId),
  }),
);

export const purchaseAttachments = fimsTable(
  "purchase_requisition_attachments",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    purchaseId: bigint("purchase_requisition_id", {
      mode: "number",
    }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
);

export const canvassing = fimsTable(
  "canvassing",
  {
    id: serial("id").primaryKey(),
    purchasingId: bigint("purchasing_id", { mode: "number" })
      .notNull()
      .unique(),
    canvasRequestNo: varchar("canvas_request_no", { length: 255 })
      .notNull()
      .unique(),
    priorityLevelId: bigint("priority_level_id", { mode: "number" }).notNull(),
    expectedStartDate: timestamp("expected_start_date").notNull(),
    expectedEndDate: timestamp("expected_end_date").notNull(),
    type: int("type").notNull().default(1),
    finalStatus: int("final_status").notNull().default(0),
    reviewer1Id: bigint("reviewer1_id", { mode: "number" }),
    reviewer2Id: bigint("reviewer2_id", { mode: "number" }),
    approver1Id: bigint("approver1_id", { mode: "number" }).notNull(),
    approver2Id: bigint("approver2_id", { mode: "number" }),
    approver3Id: bigint("approver3_id", { mode: "number" }),
    reviewer1Status: int("reviewer1_status").notNull().default(0),
    reviewer2Status: int("reviewer2_status").notNull().default(0),
    approver1Status: int("approver1_status").notNull().default(0),
    approver2Status: int("approver2_status").notNull().default(0),
    approver3Status: int("approver3_status").notNull().default(0),
    nextActionUserId: bigint("next_action_user_id", {
      mode: "number",
    }),
    nextAction: int("next_action").notNull().default(3),
    createdBy: bigint("created_by", { mode: "number" }).notNull(),
    requestedBy: bigint("requested_by", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    reviewer1Id: index("reviewer1Id").on(table.reviewer1Id),
    reviewer2Id: index("reviewer2Id").on(table.reviewer2Id),
    approver1Id: index("approver1Id").on(table.approver1Id),
    approver2Id: index("approver2Id").on(table.approver2Id),
    approver3Id: index("approver3Id").on(table.approver3Id),
    nextActionUserId: index("nextActionUserId").on(table.nextActionUserId),
    createdBy: index("createdBy").on(table.createdBy),
    requestedBy: index("requestedBy").on(table.requestedBy),
  }),
);

export const canvasService = fimsTable(
  "canvas_service",
  {
    id: serial("id").primaryKey(),
    canvasRequestNo: varchar("canvas_request_no", { length: 255 }).notNull(),
    serviceDescriptionId: bigint("service_description_id", {
      mode: "number",
    }).notNull(),
    workerId: bigint("worker_id", { mode: "number" }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    hours: int("hours").notNull(),
    extentOfWork: varchar("extent_of_work", { length: 255 }).notNull(),
    rate: float("rate").notNull(),
    reasonId: bigint("reason_id", { mode: "number" }),
    isApproved: boolean("is_approved").default(true),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    servDescIdx: index("serv_desc_idx").on(table.serviceDescriptionId),
    workerIdx: index("worker_idx").on(table.workerId),
    reasonIdx: index("reason_idx").on(table.reasonId),
    isApprovedIdx: index("is_approved_idx").on(table.isApproved),
  }),
);

export const canvasServiceAttachments = fimsTable(
  "canvas_service_attachments",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    canvasRequestNo: varchar("canvas_request_no", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    canvasRequestNoIndex: index("canvas_request_no_idx").on(
      table.canvasRequestNo,
    ),
  }),
);

export const canvasPurchase = fimsTable(
  "canvas_purchase",
  {
    id: serial("id").primaryKey(),
    canvasRequestNo: varchar("canvas_request_no", { length: 255 }).notNull(),
    itemDescriptionId: bigint("item_description_id", {
      mode: "number",
    }).notNull(),
    quantity: int("quantity").notNull(),
    supplierId: bigint("supplier_id", { mode: "number" }).notNull(),
    unitPrice: float("unit_price").notNull(),
    deliveryDate: timestamp("delivery_date").notNull(),
    paymentOptionId: bigint("payment_option_id", {
      mode: "number",
    }).notNull(),
    installmentTerms: int("installment_terms").notNull(),
    paymentTerms: int("payment_terms").notNull(),
    paymentModeId: bigint("payment_mode_id", { mode: "number" }).notNull(),
    methodOfDeliveryId: bigint("method_of_delivery_id", {
      mode: "number",
    }).notNull(),
    reasonId: bigint("reason_id", { mode: "number" }),
    isApproved: boolean("is_approved").default(true),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    supplierIdx: index("supplier_idx").on(table.supplierId),
    paymentOptionIdx: index("payment_option_idx").on(table.paymentOptionId),
    paymentModeIdx: index("payment_mode_idx").on(table.paymentModeId),
    methodOfDeliveryIdx: index("method_of_delivery_idx").on(
      table.methodOfDeliveryId,
    ),
    reasonIdx: index("reason_idx").on(table.reasonId),
    isApprovedIdx: index("is_approved_idx").on(table.isApproved),
  }),
);

export const canvasPurchaseAttachments = fimsTable(
  "canvas_purchase_attachments",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    canvasRequestNo: varchar("canvas_request_no", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    canvasRequestNoIndex: index("canvas_request_no_idx").on(
      table.canvasRequestNo,
    ),
  }),
);

export const request = fimsTable(
  "request",
  {
    id: serial("id").primaryKey(),
    purchasingId: bigint("purchasing_id", { mode: "number" })
      .notNull()
      .unique(),
    requestNo: varchar("request_no", { length: 255 }).notNull().unique(),
    priorityLevelId: bigint("priority_level_id", { mode: "number" }).notNull(),
    expectedStartDate: timestamp("expected_start_date").notNull(),
    expectedEndDate: timestamp("expected_end_date").notNull(),
    type: int("type").notNull().default(1),
    finalStatus: int("final_status").notNull().default(0),
    reviewer1Id: bigint("reviewer1_id", { mode: "number" }),
    reviewer2Id: bigint("reviewer2_id", { mode: "number" }),
    approver1Id: bigint("approver1_id", { mode: "number" }).notNull(),
    approver2Id: bigint("approver2_id", { mode: "number" }),
    approver3Id: bigint("approver3_id", { mode: "number" }),
    reviewer1Status: int("reviewer1_status").notNull().default(0),
    reviewer2Status: int("reviewer2_status").notNull().default(0),
    approver1Status: int("approver1_status").notNull().default(0),
    approver2Status: int("approver2_status").notNull().default(0),
    approver3Status: int("approver3_status").notNull().default(0),
    nextActionUserId: bigint("next_action_user_id", {
      mode: "number",
    }),
    nextAction: int("next_action").notNull().default(3),
    createdBy: bigint("created_by", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    reviewer1Id: index("reviewer1Id").on(table.reviewer1Id),
    reviewer2Id: index("reviewer2Id").on(table.reviewer2Id),
    approver1Id: index("approver1Id").on(table.approver1Id),
    approver2Id: index("approver2Id").on(table.approver2Id),
    approver3Id: index("approver3Id").on(table.approver3Id),
    nextActionUserId: index("nextActionUserId").on(table.nextActionUserId),
    createdBy: index("createdBy").on(table.createdBy),
  }),
);

export const order = fimsTable(
  "order",
  {
    id: serial("id").primaryKey(),
    purchasingId: bigint("purchasing_id", { mode: "number" })
      .notNull()
      .unique(),
    orderNo: varchar("order_no", { length: 255 }).notNull().unique(),
    priorityLevelId: bigint("priority_level_id", { mode: "number" }).notNull(),
    expectedStartDate: timestamp("expected_start_date").notNull(),
    expectedEndDate: timestamp("expected_end_date").notNull(),
    type: int("type").notNull().default(1),
    finalStatus: int("final_status").notNull().default(0),
    reviewer1Id: bigint("reviewer1_id", { mode: "number" }),
    reviewer2Id: bigint("reviewer2_id", { mode: "number" }),
    approver1Id: bigint("approver1_id", { mode: "number" }).notNull(),
    approver2Id: bigint("approver2_id", { mode: "number" }),
    approver3Id: bigint("approver3_id", { mode: "number" }),
    reviewer1Status: int("reviewer1_status").notNull().default(0),
    reviewer2Status: int("reviewer2_status").notNull().default(0),
    approver1Status: int("approver1_status").notNull().default(0),
    approver2Status: int("approver2_status").notNull().default(0),
    approver3Status: int("approver3_status").notNull().default(0),
    nextActionUserId: bigint("next_action_user_id", {
      mode: "number",
    }),
    nextAction: int("next_action").notNull().default(3),
    createdBy: bigint("created_by", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    reviewer1Id: index("reviewer1Id").on(table.reviewer1Id),
    reviewer2Id: index("reviewer2Id").on(table.reviewer2Id),
    approver1Id: index("approver1Id").on(table.approver1Id),
    approver2Id: index("approver2Id").on(table.approver2Id),
    approver3Id: index("approver3Id").on(table.approver3Id),
    nextActionUserId: index("nextActionUserId").on(table.nextActionUserId),
    createdBy: index("createdBy").on(table.createdBy),
  }),
);

export const recurring = fimsTable(
  "recurring_requisition",
  {
    id: serial("id").primaryKey(),
    requisitionNo: varchar("requisition_no", { length: 255 }).notNull(),
    serviceCategoryId: bigint("service_category_id", {
      mode: "number",
    }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    serviceCategoryId: index("service_category_id").on(table.serviceCategoryId),
    requisitionNoIdx: index("requisition_no_idx").on(table.requisitionNo),
  }),
);

export const airline = fimsTable(
  "airline_details",
  {
    id: serial("id").primaryKey(),
    referenceNo: varchar("reference_no", { length: 255 }).notNull(),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
    }).notNull(),
    carrierId: bigint("carrier_id", { mode: "number" }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    soaNumber: varchar("soa_number", { length: 255 }).notNull(),
    mawbNumber: varchar("mawb_number", { length: 255 }),
    amount: float("amount").notNull().default(0),
    rejectionId: bigint("rejection_id", { mode: "number" }),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    rejectionId: index("rejection_id").on(table.rejectionId),
    carrierIdx: index("carrier_idx").on(table.carrierId),
    referenceNo: index("reference_no").on(table.referenceNo),
    transportModeIdx: index("transport_mode_idx").on(table.transportModeId),
  }),
);

export const airlineAttachments = fimsTable("airline_attachments", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  airlineId: bigint("airline_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const utility = fimsTable(
  "utility_details",
  {
    id: serial("id").primaryKey(),
    referenceNo: varchar("reference_no", { length: 255 }).notNull(),
    utilityTypeId: bigint("utility_type_id", { mode: "number" }).notNull(),
    serviceProviderId: bigint("service_provider_id", {
      mode: "number",
    }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    soaNumber: varchar("soa_number", { length: 255 }).notNull(),
    mawbNumber: varchar("mawb_number", { length: 255 }),
    amount: float("amount").notNull().default(0),
    rejectionId: bigint("rejection_id", { mode: "number" }),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    rejectionId: index("rejection_id").on(table.rejectionId),
    utilityTypeId: index("utility_type_id").on(table.utilityTypeId),
    referenceNo: index("reference_no").on(table.referenceNo),
    serviceProviderId: index("service_provider_id").on(table.serviceProviderId),
  }),
);

export const utilityAttachments = fimsTable("utility_attachments", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  utilityId: bigint("utility_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const rentals = fimsTable(
  "lease_or_rental_details",
  {
    id: serial("id").primaryKey(),
    // 1 = Check, 2 = PDC
    type: int("type").notNull().default(1),
    referenceNo: varchar("reference_no", { length: 255 }).notNull(),
    hubId: bigint("hub_id", { mode: "number" }).notNull(),
    leasorId: bigint("leasor_id", {
      mode: "number",
    }).notNull(),
    startDate: timestamp("start_date").notNull(),
    terms: int("terms").notNull().default(0),
    endDate: timestamp("end_date"),
    amount: float("amount").notNull().default(0),
    rejectionId: bigint("rejection_id", { mode: "number" }),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    rejectionId: index("rejection_id").on(table.rejectionId),
    hubId: index("hub_id").on(table.hubId),
    referenceNo: index("reference_no").on(table.referenceNo),
    leasorId: index("leasor_id").on(table.leasorId),
  }),
);

export const rentalsAttachments = fimsTable("rentals_attachments", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  rentalId: bigint("rental_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const subscriptionDetail = fimsTable(
  "subscription_details",
  {
    id: serial("id").primaryKey(),
    referenceNo: varchar("reference_no", { length: 255 }).notNull(),
    subscriptionId: bigint("subscription_id", { mode: "number" }).notNull(),
    providerId: bigint("provider_id", {
      mode: "number",
    }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    soaNumber: varchar("soa_number", { length: 255 }).notNull(),
    amount: float("amount").notNull().default(0),
    rejectionId: bigint("rejection_id", { mode: "number" }),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    rejectionId: index("rejection_id").on(table.rejectionId),
    providerId: index("provider_id").on(table.providerId),
    subscriptionId: index("subscription_id").on(table.subscriptionId),
    referenceNo: index("reference_no").on(table.referenceNo),
  }),
);

export const subscriptionsAttachments = fimsTable("subscriptions_attachments", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  subscriptionId: bigint("subscription_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
