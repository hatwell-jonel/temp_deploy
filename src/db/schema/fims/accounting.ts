import { particularType } from "@/config/enums";
import { fimsTable } from "@/db/schema/_table";
import { months } from "@/lib/utils";
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  float,
  index,
  int,
  mysqlEnum,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

const monthEnum = mysqlEnum("month", months).notNull();

export const availment = fimsTable(
  "availment",
  {
    id: serial("id").primaryKey(),
    requisitionNo: varchar("requisition_no", { length: 255 }).notNull(),
    budgetSourceId: bigint("budget_source_id", {
      mode: "number",
    }).notNull(),
    subAccountId: bigint("sub_account_id", {
      mode: "number",
    }).notNull(),
    coaId: bigint("coa_id", {
      mode: "number",
    }).notNull(),
    opexId: bigint("opex_id", {
      mode: "number",
    }).notNull(),
    month: monthEnum,
    year: int("year").notNull(),
    amount: float("amount").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
  },
  (table) => ({
    budgetSourceIdx: index("budget_source_idx").on(table.budgetSourceId),
    subAccountIdx: index("sub_account_idx").on(table.subAccountId),
    coaIdx: index("coa_idx").on(table.coaId),
    opexIdx: index("opex_idx").on(table.opexId),
    requisitionNoIdx: index("requisition_no_idx").on(table.requisitionNo),
    uniqueReq: unique("unique_requisition").on(table.requisitionNo),
  }),
);

export const yearlyBudget = fimsTable(
  "yearly_budget",
  {
    id: serial("id").primaryKey(),
    opexCategoryId: bigint("opex_category_id", {
      mode: "number",
    }).notNull(),
    chartOfAccountsId: bigint("chart_of_accounts_id", {
      mode: "number",
    }).notNull(),
    divisionId: bigint("division_id", { mode: "number" }).notNull(),
    year: int("year").notNull(),
    jan: float("jan").default(0).notNull(),
    feb: float("feb").default(0).notNull(),
    mar: float("mar").default(0).notNull(),
    apr: float("apr").default(0).notNull(),
    may: float("may").default(0).notNull(),
    jun: float("jun").default(0).notNull(),
    jul: float("jul").default(0).notNull(),
    aug: float("aug").default(0).notNull(),
    sep: float("sep").default(0).notNull(),
    oct: float("oct").default(0).notNull(),
    nov: float("nov").default(0).notNull(),
    dece: float("dece").default(0).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    yearIdx: index("year_idx").on(table.year),
    chartOfAccountsIdx: index("chart_of_accounts_idx").on(
      table.chartOfAccountsId,
    ),
    opexIdx: index("opex_idx").on(table.opexCategoryId),
    uniqueCOA: unique("unique_coa").on(
      table.chartOfAccountsId,
      table.divisionId,
      table.year,
    ),
  }),
);

export const rfp = fimsTable(
  "rfp",
  {
    id: serial("id").primaryKey(),
    rfpNo: varchar("rfp_no", { length: 255 }).notNull().unique(),
    purchasingId: bigint("purchasing_id", { mode: "number" })
      .notNull()
      .unique(),
    dateRequested: timestamp("date_requested")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    dateNeeded: timestamp("date_needed").notNull(),
    transactionDateFrom: timestamp("transaction_date_from").notNull(),
    transactionDateTo: timestamp("transaction_date_to").notNull(),
    dueDate: timestamp("due_date").notNull(),
    priorityLevelId: bigint("priority_level_id", {
      mode: "number",
    }).notNull(),
    requestorId: bigint("requestor_id", {
      mode: "number",
    }).notNull(),
    status: int("status").default(0).notNull(),
    amount: float("amount").default(0).notNull(),
    tin: varchar("tin", { length: 255 }).notNull().default("008-022-724-000"),
    requestType: mysqlEnum("request_type", ["RFP"]).default("RFP"),
    payeeId: bigint("payee_id", { mode: "number" }).notNull(),
    subPayee: bigint("sub_payee_id", { mode: "number" }),
    releaseDate: timestamp("release_date"),
    isDraft: boolean("is_draft").default(true),
    particularType: mysqlEnum("particular_type", particularType)
      .default(particularType[0])
      .notNull(),
    budgetSourceId: bigint("budget_source_id", { mode: "number" }).notNull(),
    opexCategoryId: bigint("opex_category_id", { mode: "number" }).notNull(),
    chartOfAccountId: bigint("chart_of_account_id", {
      mode: "number",
    }).notNull(),
    joNumber: varchar("jo_number", { length: 255 }),
    poNumber: varchar("po_number", { length: 255 }),
    subAccountId: bigint("sub_account_id", { mode: "number" }).notNull(),
    remarks: varchar("remarks", { length: 255 }),
    requestedBy: bigint("requested_by", { mode: "number" }).notNull(),
    vatable: boolean("vatable").default(false),
    ewtPercentage: float("ewt_percentage"),
    reasonForRejectionId: bigint("reason_for_rejection_id", { mode: "number" }),
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
    reviewer1StatusDate: timestamp("reviewer1_status_date"),
    reviewer2StatusDate: timestamp("reviewer2_status_date"),
    approver1StatusDate: timestamp("approver1_status_date"),
    approver2StatusDate: timestamp("approver2_status_date"),
    approver3StatusDate: timestamp("approver3_status_date"),
    reviewer1remarks: varchar("reviewer1_remarks", { length: 255 }),
    reviewer2remarks: varchar("reviewer2_remarks", { length: 255 }),
    approver1remarks: varchar("approver1_remarks", { length: 255 }),
    approver2remarks: varchar("approver2_remarks", { length: 255 }),
    approver3remarks: varchar("approver3_remarks", { length: 255 }),
    nextActionUserId: bigint("next_action_user_id", { mode: "number" }),
    nextAction: int("next_action").notNull().default(3),
    createdBy: int("created_by").notNull(),
  },
  (table) => ({
    priorityLevelIdx: index("priority_level_idx").on(table.priorityLevelId),
    requestorIdx: index("requestor_idx").on(table.requestorId),
    payeeIdx: index("payee_idx").on(table.payeeId),
    subPayeeIdx: index("sub_payee_idx").on(table.subPayee),
    particularTypeIdx: index("particular_type_idx").on(table.particularType),
    budgetSourceIdx: index("budget_source_idx").on(table.budgetSourceId),
    opexCategoryIdx: index("opex_category_idx").on(table.opexCategoryId),
    chartOfAccountIdx: index("chart_of_account_idx").on(table.chartOfAccountId),
    subAccountIdx: index("sub_account_idx").on(table.chartOfAccountId),
    requestedByIdx: index("requested_by_idx").on(table.requestedBy),
    reviewer1Idx: index("reviewer1Idx").on(table.reviewer1Id),
    reviewer2Idx: index("reviewer2Idx").on(table.reviewer2Id),
    approver1Idx: index("approver1Idx").on(table.approver1Id),
    approver2Idx: index("approver2Idx").on(table.approver2Id),
    approver3Idx: index("approver3Idx").on(table.approver3Id),
    nextActionUserIdIdx: index("nextActionUserIdIdx").on(
      table.nextActionUserId,
    ),
    createdByIdx: index("createdByIdx").on(table.createdBy),
    reasonForRejectionIdIdx: index("reason_for_rejection_id_idx").on(
      table.reasonForRejectionId,
    ),
    poNumberIdx: index("po_number_idx").on(table.poNumber),
    joNumberIdx: index("jo_number_idx").on(table.joNumber),
  }),
);

export const rfpAttachments = fimsTable(
  "rfp_attachments",
  {
    id: serial("id").primaryKey(),
    rfpNo: varchar("rfp_no", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    size: float("size").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    rfpNo: index("rfp_no_idx").on(table.rfpNo),
  }),
);

export const rfpParticulars = fimsTable(
  "rfp_particulars",
  {
    id: serial("id").primaryKey(),
    rfpNo: varchar("rfp_no", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    amount: float("amount").notNull(),
    quantity: int("quantity").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    rfpNo: index("rfp_no_idx").on(table.rfpNo),
  }),
);

export const checkVoucher = fimsTable(
  "check_voucher",
  {
    id: serial("id").primaryKey(),
    cvNo: varchar("cv_no", { length: 255 }).notNull().unique(),
    purchasingId: bigint("purchasing_id", { mode: "number" })
      .notNull()
      .unique(),
    rfpNo: varchar("rfp_no", { length: 255 }).notNull(),
    checkNumber: varchar("check_number", { length: 255 }),
    status: int("status").notNull().default(0),
    reasonForRejectionId: bigint("reason_for_rejection_id", { mode: "number" }),
    releaseDate: date("release_date"),
    isDraft: boolean("is_draft").default(true),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    reviewer1Id: bigint("reviewer1_id", { mode: "number" }),
    reviewer2Id: bigint("reviewer2_id", { mode: "number" }),
    approver1Id: bigint("approver1_id", { mode: "number" }).notNull(),
    approver2Id: bigint("approver2_id", { mode: "number" }),
    approver3Id: bigint("approver3_id", { mode: "number" }),
    finalStatus: int("final_status").notNull().default(0),
    reviewer1Status: int("reviewer1_status").notNull().default(0),
    reviewer2Status: int("reviewer2_status").notNull().default(0),
    approver1Status: int("approver1_status").notNull().default(0),
    approver2Status: int("approver2_status").notNull().default(0),
    approver3Status: int("approver3_status").notNull().default(0),
    nextActionUserId: bigint("next_action_user_id", { mode: "number" }),
    nextAction: int("next_action").notNull().default(3),
    createdBy: int("created_by").notNull().notNull(),
  },
  (table) => ({
    rfpNo: index("rfp_no_idx").on(table.rfpNo),
    reasonForRejectionIdIndex: index("reason_for_rejection_id").on(
      table.reasonForRejectionId,
    ),
    reviewer1Idx: index("reviewer1Idx").on(table.reviewer1Id),
    reviewer2Idx: index("reviewer2Idx").on(table.reviewer2Id),
    approver1Idx: index("approver1Idx").on(table.approver1Id),
    approver2Idx: index("approver2Idx").on(table.approver2Id),
    approver3Idx: index("approver3Idx").on(table.approver3Id),
    nextActionUserIdIdx: index("nextActionUserIdIdx").on(
      table.nextActionUserId,
    ),
    createdByIdx: index("created_by_idx").on(table.createdBy),
  }),
);

export const checkVoucherOrSiNumber = fimsTable(
  "check_voucher_or_si_number",
  {
    id: serial("id").primaryKey(),
    cvNo: varchar("cv_no", { length: 255 }).notNull(),
    orNumber: varchar("or_number", { length: 255 }).unique(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    cvNoIdx: index("cv_no_idx").on(table.cvNo),
  }),
);

export const cashAdvanceType = fimsTable(
  "cash_advance_type",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
  }),
);

export const cashAdvance = fimsTable("cash_advance", {
  id: serial("id").primaryKey(),
  requestTypeId: bigint("request_type_id", { mode: "number" }).notNull(),
  cashAdvanceNo: varchar("cash_advance_no", { length: 255 }).notNull(),
  payeeId: bigint("payee_id", { mode: "number" }).notNull(),
  subPayeeId: bigint("sub_payee_id", { mode: "number" }).notNull(),
  requestedAmount: float("requested_amount").notNull(),
  requestorId: bigint("requestorId", { mode: "number" }).notNull(),
  dateNeeded: timestamp("date_needed").notNull(),
  releaseDate: timestamp("release_date").notNull(),
  status: int("status").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const pettyCash = fimsTable("petty_cash", {
  id: serial("id").primaryKey(),
  subAccountId: bigint("sub_account_id", { mode: "number" }).notNull(),
  dateNeeded: timestamp("date_needed").notNull(),
  transactionDateFrom: timestamp("transaction_date_from").notNull(),
  transactionDateTo: timestamp("transaction_date_to").notNull(),
  purpose: varchar("purpose", { length: 255 }).notNull(),
  requestedAmount: float("requested_amount").notNull(),
  receiptNo: varchar("receipt_no", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const pettyCashAttachments = fimsTable("petty_cash_attachments", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  pettyCashId: bigint("petty_cash_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const singleTransaction = fimsTable("single_transaction", {
  id: serial("id").primaryKey(),
  subAccountId: bigint("sub_account_id", { mode: "number" }).notNull(),
  dateNeeded: timestamp("date_needed").notNull(),
  transactionDateFrom: timestamp("transaction_date_from").notNull(),
  transactionDateTo: timestamp("transaction_date_to").notNull(),
  purpose: varchar("purpose", { length: 255 }).notNull(),
  requestedAmount: float("requested_amount").notNull(),
  receiptNo: varchar("receipt_no", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const singleTransactionAttachments = fimsTable(
  "single_transaction_attachments",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    singleTransactionId: bigint("single_transaction_id", {
      mode: "number",
    }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
);

export const revolvingFunds = fimsTable("revolving_funds", {
  id: serial("id").primaryKey(),
  subAccountId: bigint("sub_account_id", { mode: "number" }).notNull(),
  dateNeeded: timestamp("date_needed").notNull(),
  transactionDateFrom: timestamp("transaction_date_from").notNull(),
  transactionDateTo: timestamp("transaction_date_to").notNull(),
  purpose: varchar("purpose", { length: 255 }).notNull(),
  requestedAmount: float("requested_amount").notNull(),
  receiptNo: varchar("receipt_no", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const revolvingFundsAttachments = fimsTable(
  "revolving_funds_attachments",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    revolvingFundsId: bigint("revolving_funds_id", {
      mode: "number",
    }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
);

export const freight = fimsTable("freight", {
  id: serial("id").primaryKey(),
  voyageNo: varchar("voyage_no", { length: 255 }).notNull(),
  wingVanId: bigint("wing_van_id", { mode: "number" }).notNull(),
  subAccountId: bigint("sub_account_id", { mode: "number" }).notNull(),
  dateNeeded: timestamp("date_needed").notNull(),
  transactionDateFrom: timestamp("transaction_date_from").notNull(),
  transactionDateTo: timestamp("transaction_date_to").notNull(),
  purpose: varchar("purpose", { length: 255 }).notNull(),
  requestedAmount: float("requested_amount").notNull(),
  receiptNo: varchar("receipt_no", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const freightAttachments = fimsTable("freight_attachments", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  freightId: bigint("freight_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
