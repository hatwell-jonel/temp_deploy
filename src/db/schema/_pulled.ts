import { sql } from "drizzle-orm";
import {
  bigint,
  char,
  date,
  datetime,
  decimal,
  double,
  index,
  int,
  longtext,
  mysqlTable,
  primaryKey,
  text,
  time,
  timestamp,
  tinyint,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const accountStatusReference = mysqlTable(
  "account_status_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    textColor: varchar("text_color", { length: 255 }),
    bgColor: varchar("bg_color", { length: 255 }),
    isVisible: bigint("is_visible", { mode: "number", unsigned: true })
      .default(1)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountStatusReferenceId: primaryKey({
        columns: [table.id],
        name: "account_status_reference_id",
      }),
    };
  },
);

export const accountTypeReference = mysqlTable(
  "account_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: bigint("is_visible", { mode: "number", unsigned: true })
      .default(1)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "account_type_reference_id",
      }),
    };
  },
);

export const accountingAccountTypeReference = mysqlTable(
  "accounting_account_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingAccountTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_account_type_reference_id",
      }),
    };
  },
);

export const accountingBankValidations = mysqlTable(
  "accounting_bank_validations",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    transactionDate: date("transaction_date", { mode: "string" }),
    checkNo: varchar("check_no", { length: 255 }),
    description: longtext("description"),
    debitAmount: double("debit_amount", { precision: 11, scale: 2 }),
    creditAmount: double("credit_amount", { precision: 11, scale: 2 }),
    balanceAmount: double("balance_amount", { precision: 11, scale: 2 }),
    branch: varchar("branch", { length: 255 }),
    mbBranch: varchar("mb_branch", { length: 255 }),
    accountNo: varchar("account_no", { length: 255 }),
    paymentTypeId: bigint("payment_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingPaymentTypeReference.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingBankValidationsId: primaryKey({
        columns: [table.id],
        name: "accounting_bank_validations_id",
      }),
    };
  },
);

export const accountingBudgetAvailment = mysqlTable(
  "accounting_budget_availment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    requestForPaymentId: bigint("request_for_payment_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingRequestForPayment.id),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    budgetSourceId: bigint("budget_source_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingBudgetSource.id),
    budgetChartId: bigint("budget_chart_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingBudgetChart.id),
    budgetPlanId: bigint("budget_plan_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingBudgetPlan.id),
    amount: double("amount", { precision: 11, scale: 2 }).notNull(),
    month: varchar("month", { length: 255 }).notNull(),
    year: int("year").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingBudgetAvailmentId: primaryKey({
        columns: [table.id],
        name: "accounting_budget_availment_id",
      }),
    };
  },
);

export const accountingBudgetChart = mysqlTable(
  "accounting_budget_chart",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    budgetSourceId: bigint("budget_source_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingBudgetSource.id),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingBudgetChartId: primaryKey({
        columns: [table.id],
        name: "accounting_budget_chart_id",
      }),
    };
  },
);

export const accountingBudgetLoa = mysqlTable(
  "accounting_budget_loa",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    budgetPlanId: bigint("budget_plan_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingBudgetPlan.id),
    limitMinAmount: double("limit_min_amount"),
    limitMaxAmount: double("limit_max_amount"),
    firstApproverId: bigint("first_approver_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    secondApproverId: bigint("second_approver_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    thirdApproverId: bigint("third_approver_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingBudgetLoaId: primaryKey({
        columns: [table.id],
        name: "accounting_budget_loa_id",
      }),
    };
  },
);

export const accountingBudgetPlan = mysqlTable(
  "accounting_budget_plan",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rfpTypeId: bigint("rfp_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingRfpTypeReference.id),
    divisionId: bigint("division_id", {
      mode: "number",
      unsigned: true,
    }).references(() => division.id),
    budgetSourceId: bigint("budget_source_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingBudgetSource.id),
    budgetChartId: bigint("budget_chart_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingBudgetChart.id),
    item: varchar("item", { length: 255 }),
    opexTypeId: bigint("opex_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingOpexType.id),
    year: int("year"),
    january: double("january", { precision: 11, scale: 2 }),
    february: double("february", { precision: 11, scale: 2 }),
    march: double("march", { precision: 11, scale: 2 }),
    april: double("april", { precision: 11, scale: 2 }),
    may: double("may", { precision: 11, scale: 2 }),
    june: double("june", { precision: 11, scale: 2 }),
    july: double("july", { precision: 11, scale: 2 }),
    august: double("august", { precision: 11, scale: 2 }),
    september: double("september", { precision: 11, scale: 2 }),
    october: double("october", { precision: 11, scale: 2 }),
    november: double("november", { precision: 11, scale: 2 }),
    december: double("december", { precision: 11, scale: 2 }),
    totalAmount: double("total_amount", { precision: 11, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingBudgetPlanId: primaryKey({
        columns: [table.id],
        name: "accounting_budget_plan_id",
      }),
    };
  },
);

export const accountingBudgetSource = mysqlTable(
  "accounting_budget_source",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingBudgetSourceId: primaryKey({
        columns: [table.id],
        name: "accounting_budget_source_id",
      }),
    };
  },
);

export const accountingCaReferenceTypes = mysqlTable(
  "accounting_ca_reference_types",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingCaReferenceTypesId: primaryKey({
        columns: [table.id],
        name: "accounting_ca_reference_types_id",
      }),
    };
  },
);

export const accountingCanvassing = mysqlTable(
  "accounting_canvassing",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    referenceId: varchar("reference_id", { length: 255 }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    approver1Id: int("approver1_id"),
    approver2Id: int("approver2_id"),
    approver3Id: int("approver3_id"),
    approver1Status: int("approver1_status"),
    approver2Status: int("approver2_status"),
    approver3Status: int("approver3_status"),
    approver1Date: datetime("approver1_date", { mode: "string" }),
    approver2Date: datetime("approver2_date", { mode: "string" }),
    approver3Date: datetime("approver3_date", { mode: "string" }),
    approver1Remarks: longtext("approver1_remarks"),
    approver2Remarks: longtext("approver2_remarks"),
    approver3Remarks: longtext("approver3_remarks"),
    srprReferenceNo: varchar("srpr_reference_no", { length: 255 }),
    canvassApprovalStatus: int("canvass_approval_status"),
  },
  (table) => {
    return {
      accountingCanvassingId: primaryKey({
        columns: [table.id],
        name: "accounting_canvassing_id",
      }),
    };
  },
);

export const accountingCanvassingSupplier = mysqlTable(
  "accounting_canvassing_supplier",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    canvassingId: bigint("canvassing_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingCanvassing.id),
    supplierId: bigint("supplier_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingSupplier.id),
    poReferenceNo: varchar("po_reference_no", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    approver1Id: int("approver1_id"),
    approver2Id: int("approver2_id"),
    approver3Id: int("approver3_id"),
    approver1Status: int("approver1_status"),
    approver2Status: int("approver2_status"),
    approver3Status: int("approver3_status"),
    approver1Date: datetime("approver1_date", { mode: "string" }),
    approver2Date: datetime("approver2_date", { mode: "string" }),
    approver3Date: datetime("approver3_date", { mode: "string" }),
    approver1Remarks: longtext("approver1_remarks"),
    approver2Remarks: longtext("approver2_remarks"),
    approver3Remarks: longtext("approver3_remarks"),
    srprReferenceNo: int("srpr_reference_no"),
  },
  (table) => {
    return {
      accountingCanvassingSupplierId: primaryKey({
        columns: [table.id],
        name: "accounting_canvassing_supplier_id",
      }),
    };
  },
);

export const accountingCashFlowDetails = mysqlTable(
  "accounting_cash_flow_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    encashmentDate: date("encashment_date", { mode: "string" }),
    checkNo: varchar("check_no", { length: 255 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    cvDate: date("cv_date", { mode: "string" }),
    payeeId: bigint("payee_id", { mode: "number", unsigned: true }).references(
      () => accountingSupplier.id,
    ),
    checkDescription: longtext("check_description"),
    encashmentAmount: double("encashment_amount", { precision: 11, scale: 2 }),
    lockedAmount: double("locked_amount", { precision: 11, scale: 2 }),
    statusId: bigint("status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingCfStatusReference.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingCashFlowDetailsId: primaryKey({
        columns: [table.id],
        name: "accounting_cash_flow_details_id",
      }),
    };
  },
);

export const accountingCashFlowSnapshot = mysqlTable(
  "accounting_cash_flow_snapshot",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    currentBalance: double("current_balance", { precision: 11, scale: 2 }),
    floatingBalance: double("floating_balance", { precision: 11, scale: 2 }),
    year: int("year"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingCashFlowSnapshotId: primaryKey({
        columns: [table.id],
        name: "accounting_cash_flow_snapshot_id",
      }),
    };
  },
);

export const accountingCfStatusReference = mysqlTable(
  "accounting_cf_status_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingCfStatusReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_cf_status_reference_id",
      }),
    };
  },
);

export const accountingCheckVoucher = mysqlTable(
  "accounting_check_voucher",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    requestForPaymentId: bigint("request_for_payment_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingRequestForPayment.id),
    cvNo: varchar("cv_no", { length: 255 }).notNull(),
    referenceNo: varchar("reference_no", { length: 255 }).notNull(),
    totalAmount: double("total_amount", { precision: 11, scale: 2 }).notNull(),
    description: longtext("description").notNull(),
    statusId: bigint("status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingStatusReference.id),
    isApproved1: tinyint("is_approved_1"),
    isApproved2: tinyint("is_approved_2"),
    approver1Id: bigint("approver_1_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    approver2Id: bigint("approver_2_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver1Date: date("approver_1_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver2Date: date("approver_2_date", { mode: "string" }),
    approver1Remarks: longtext("approver_1_remarks"),
    approver2Remarks: longtext("approver_2_remarks"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    releaseDate: date("release_date", { mode: "string" }),
    receivedBy: bigint("received_by", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingSupplier.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    receivedDate: date("received_date", { mode: "string" }),
    receivedRemarks: longtext("received_remarks"),
    createdBy: bigint("created_by", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    scheduleReleaseDate: date("schedule_release_date", { mode: "string" }),
  },
  (table) => {
    return {
      accountingCheckVoucherId: primaryKey({
        columns: [table.id],
        name: "accounting_check_voucher_id",
      }),
    };
  },
);

export const accountingCheckVoucherAttachments = mysqlTable(
  "accounting_check_voucher_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    checkVoucherId: bigint("check_voucher_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingCheckVoucher.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingCheckVoucherAttachmentsId: primaryKey({
        columns: [table.id],
        name: "accounting_check_voucher_attachments_id",
      }),
    };
  },
);

export const accountingCheckVoucherDetails = mysqlTable(
  "accounting_check_voucher_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    checkVoucherId: bigint("check_voucher_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingCheckVoucher.id),
    voucherNo: varchar("voucher_no", { length: 255 }).notNull(),
    description: longtext("description").notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    date: date("date", { mode: "string" }).notNull(),
    amount: double("amount", { precision: 11, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingCheckVoucherDetailsId: primaryKey({
        columns: [table.id],
        name: "accounting_check_voucher_details_id",
      }),
    };
  },
);

export const accountingCvsSuppAttachments = mysqlTable(
  "accounting_cvs_supp_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    canvassingSupplierId: bigint("canvassing_supplier_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingCanvassingSupplier.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingCvsSuppAttachmentsId: primaryKey({
        columns: [table.id],
        name: "accounting_cvs_supp_attachments_id",
      }),
    };
  },
);

export const accountingCvsSupplierItem = mysqlTable(
  "accounting_cvs_supplier_item",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    canvassingSupplierId: bigint("canvassing_supplier_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingCanvassingSupplier.id),
    supplierItemId: bigint("supplier_item_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingSupplierItem.id),
    unitCost: double("unit_cost", { precision: 11, scale: 2 }),
    quantity: int("quantity"),
    totalAmount: double("total_amount").notNull(),
    recommendedStatus: tinyint("recommended_status").default(0).notNull(),
    finalStatus: tinyint("final_status").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    waybillFrom: varchar("waybill_from", { length: 255 }),
    waybillTo: varchar("waybill_to", { length: 255 }),
    waybillIdentify: tinyint("waybill_identify"),
  },
  (table) => {
    return {
      accountingCvsSupplierItemId: primaryKey({
        columns: [table.id],
        name: "accounting_cvs_supplier_item_id",
      }),
    };
  },
);

export const accountingFreightReferenceType = mysqlTable(
  "accounting_freight_reference_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingFreightReferenceTypeId: primaryKey({
        columns: [table.id],
        name: "accounting_freight_reference_type_id",
      }),
    };
  },
);

export const accountingFreightUsageReference = mysqlTable(
  "accounting_freight_usage_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingFreightUsageReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_freight_usage_reference_id",
      }),
    };
  },
);

export const accountingLiquidation = mysqlTable(
  "accounting_liquidation",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    liquidationReferenceNo: varchar("liquidation_reference_no", {
      length: 255,
    }),
    liquidationTotalAmount: double("liquidation_total_amount", {
      precision: 11,
      scale: 2,
    }),
    statusId: bigint("status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingLiquidationStatusReference.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingLiquidationId: primaryKey({
        columns: [table.id],
        name: "accounting_liquidation_id",
      }),
    };
  },
);

export const accountingLiquidationAttachments = mysqlTable(
  "accounting_liquidation_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    ldId: bigint("ld_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingLiquidationDetails.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingLiquidationAttachmentsId: primaryKey({
        columns: [table.id],
        name: "accounting_liquidation_attachments_id",
      }),
    };
  },
);

export const accountingLiquidationDetails = mysqlTable(
  "accounting_liquidation_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    liquidationId: bigint("liquidation_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingLiquidation.id),
    orNo: varchar("or_no", { length: 255 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    transactionDate: date("transaction_date", { mode: "string" }),
    amount: double("amount", { precision: 11, scale: 2 }),
    cashOnHand: double("cash_on_hand", { precision: 11, scale: 2 }),
    description: longtext("description"),
    remarks: longtext("remarks"),
    createdBy: bigint("created_by", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingLiquidationDetailsId: primaryKey({
        columns: [table.id],
        name: "accounting_liquidation_details_id",
      }),
      accountingLiquidationDetailsOrNoUnique: unique(
        "accounting_liquidation_details_or_no_unique",
      ).on(table.orNo),
    };
  },
);

export const accountingLiquidationDetailsRequest = mysqlTable(
  "accounting_liquidation_details_request",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    ldId: bigint("ld_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingLiquidationDetails.id),
    rfpId: bigint("rfp_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingRequestForPayment.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingLiquidationDetailsRequestId: primaryKey({
        columns: [table.id],
        name: "accounting_liquidation_details_request_id",
      }),
    };
  },
);

export const accountingLiquidationRequest = mysqlTable(
  "accounting_liquidation_request",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    liquidationId: bigint("liquidation_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingLiquidation.id),
    rfpId: bigint("rfp_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingRequestForPayment.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingLiquidationRequestId: primaryKey({
        columns: [table.id],
        name: "accounting_liquidation_request_id",
      }),
    };
  },
);

export const accountingLiquidationStatusReference = mysqlTable(
  "accounting_liquidation_status_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingLiquidationStatusReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_liquidation_status_reference_id",
      }),
    };
  },
);

export const accountingLoaders = mysqlTable(
  "accounting_loaders",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    loadersTypeId: bigint("loaders_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingLoadersTypeReference.id),
    code: varchar("code", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    address: varchar("address", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingLoadersId: primaryKey({
        columns: [table.id],
        name: "accounting_loaders_id",
      }),
    };
  },
);

export const accountingLoadersTypeReference = mysqlTable(
  "accounting_loaders_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingLoadersTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_loaders_type_reference_id",
      }),
    };
  },
);

export const accountingMultipleBudgetReference = mysqlTable(
  "accounting_multiple_budget_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingMultipleBudgetReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_multiple_budget_reference_id",
      }),
    };
  },
);

export const accountingOpexType = mysqlTable(
  "accounting_opex_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: longtext("description"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingOpexTypeId: primaryKey({
        columns: [table.id],
        name: "accounting_opex_type_id",
      }),
    };
  },
);

export const accountingPaymentTypeReference = mysqlTable(
  "accounting_payment_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingPaymentTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_payment_type_reference_id",
      }),
    };
  },
);

export const accountingPoWaybill = mysqlTable(
  "accounting_po_waybill",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybill: varchar("waybill", { length: 255 }).notNull(),
    branchId: bigint("branch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    cvsReferenceId: bigint("cvs_reference_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingCanvassing.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingPoWaybillId: primaryKey({
        columns: [table.id],
        name: "accounting_po_waybill_id",
      }),
    };
  },
);

export const accountingPriorityReference = mysqlTable(
  "accounting_priority_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingPriorityReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_priority_reference_id",
      }),
    };
  },
);

export const accountingRequestForPayment = mysqlTable(
  "accounting_request_for_payment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    parentReferenceNo: varchar("parent_reference_no", { length: 255 }),
    referenceId: varchar("reference_id", { length: 255 }),
    typeId: bigint("type_id", { mode: "number", unsigned: true }).references(
      () => accountingRfpTypeReference.id,
    ),
    isPayeeContactPerson: tinyint("is_payee_contact_person").default(0),
    payeeId: bigint("payee_id", { mode: "number", unsigned: true }).references(
      () => accountingSupplier.id,
    ),
    subpayee: varchar("subpayee", { length: 255 }),
    isSubpayee: varchar("is_subpayee", { length: 255 }),
    description: longtext("description"),
    amount: double("amount", { precision: 11, scale: 2 }),
    remarks: longtext("remarks"),
    multipleBudgetId: bigint("multiple_budget_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingMultipleBudgetReference.id),
    userId: bigint("user_id", { mode: "number", unsigned: true }).references(
      () => users.id,
    ),
    branchId: bigint("branch_id", {
      mode: "number",
      unsigned: true,
    }).references(() => branchReference.id),
    budgetId: bigint("budget_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingBudgetPlan.id),
    priorityId: bigint("priority_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingPriorityReference.id),
    canvasser: varchar("canvasser", { length: 255 }),
    canvassingSupplierId: bigint("canvassing_supplier_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingCanvassingSupplier.id),
    caNo: varchar("ca_no", { length: 255 }),
    caReferenceTypeId: bigint("ca_reference_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingCaReferenceTypes.id),
    accountTypeId: bigint("account_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingAccountTypeReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateNeeded: date("date_needed", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateOfTransactionFrom: date("date_of_transaction_from", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateOfTransactionTo: date("date_of_transaction_to", { mode: "string" }),
    isSetApprover1: tinyint("is_set_approver_1").default(0),
    approver1Id: bigint("approver_1_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    approver2Id: bigint("approver_2_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    approver3Id: bigint("approver_3_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    isApproved1: tinyint("is_approved_1"),
    isApproved2: tinyint("is_approved_2"),
    isApproved3: tinyint("is_approved_3"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approverDate1: date("approver_date_1", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approverDate2: date("approver_date_2", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approverDate3: date("approver_date_3", { mode: "string" }),
    approverRemarks1: longtext("approver_remarks_1"),
    approverRemarks2: longtext("approver_remarks_2"),
    approverRemarks3: longtext("approver_remarks_3"),
    opexTypeId: bigint("opex_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingOpexType.id),
    statusId: bigint("status_id", { mode: "number", unsigned: true })
      .default(1)
      .references(() => accountingStatusReference.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingRequestForPaymentId: primaryKey({
        columns: [table.id],
        name: "accounting_request_for_payment_id",
      }),
    };
  },
);

export const accountingRfpAttachments = mysqlTable(
  "accounting_rfp_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    requestForPaymentId: bigint("request_for_payment_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingRequestForPayment.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingRfpAttachmentsId: primaryKey({
        columns: [table.id],
        name: "accounting_rfp_attachments_id",
      }),
    };
  },
);

export const accountingRfpDetails = mysqlTable(
  "accounting_rfp_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    requestForPaymentId: bigint("request_for_payment_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingRequestForPayment.id),
    referenceId: varchar("reference_id", { length: 255 }),
    caReferenceNo: varchar("ca_reference_no", { length: 255 }),
    particulars: varchar("particulars", { length: 255 }),
    plateNo: varchar("plate_no", { length: 255 }),
    laborCost: double("labor_cost", { precision: 11, scale: 2 }),
    unitCost: double("unit_cost", { precision: 11, scale: 2 }),
    quantity: varchar("quantity", { length: 255 }),
    amount: double("amount", { precision: 11, scale: 2 }),
    loadersId: bigint("loaders_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingLoaders.id),
    freightReferenceNo: varchar("freight_reference_no", { length: 255 }),
    freightReferenceTypeId: bigint("freight_reference_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingFreightReferenceType.id),
    soaNo: varchar("soa_no", { length: 255 }),
    truckingTypeId: bigint("trucking_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingTruckingTypeReference.id),
    truckingAmount: double("trucking_amount", { precision: 11, scale: 2 }),
    freightAmount: double("freight_amount", { precision: 11, scale: 2 }),
    freightUsageId: bigint("freight_usage_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingFreightUsageReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    transactionDate: date("transaction_date", { mode: "string" }),
    allowance: double("allowance", { precision: 11, scale: 2 }),
    accountNo: varchar("account_no", { length: 255 }),
    paymentTypeId: bigint("payment_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingPaymentTypeReference.id),
    termsId: bigint("terms_id", { mode: "number", unsigned: true }).references(
      () => accountingTermsReference.id,
    ),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    pdcFrom: date("pdc_from", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    pdcTo: date("pdc_to", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    pdcDate: date("pdc_date", { mode: "string" }),
    invoice: varchar("invoice", { length: 255 }),
    invoiceAmount: double("invoice_amount", { precision: 11, scale: 2 }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingRfpDetailsId: primaryKey({
        columns: [table.id],
        name: "accounting_rfp_details_id",
      }),
    };
  },
);

export const accountingRfpTypeReference = mysqlTable(
  "accounting_rfp_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingRfpTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_rfp_type_reference_id",
      }),
    };
  },
);

export const accountingStatusReference = mysqlTable(
  "accounting_status_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    type: varchar("type", { length: 255 }).default("1").notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingStatusReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_status_reference_id",
      }),
    };
  },
);

export const accountingSupplier = mysqlTable(
  "accounting_supplier",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    company: varchar("company", { length: 255 }).notNull(),
    industryId: bigint("industry_id", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingSupplierIndustryReference.id),
    typeId: bigint("type_id", { mode: "number", unsigned: true }).references(
      () => accountingSupplierTypeReference.id,
    ),
    branchId: bigint("branch_id", {
      mode: "number",
      unsigned: true,
    }).references(() => branchReference.id),
    firstName: varchar("first_name", { length: 255 }),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    mobileNumber: varchar("mobile_number", { length: 255 }),
    telephoneNumber: varchar("telephone_number", { length: 255 }),
    address: longtext("address"),
    contactPerson: varchar("contact_person", { length: 255 }),
    terms: varchar("terms", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingSupplierId: primaryKey({
        columns: [table.id],
        name: "accounting_supplier_id",
      }),
      accountingSupplierCompanyUnique: unique(
        "accounting_supplier_company_unique",
      ).on(table.company),
    };
  },
);

export const accountingSupplierIndustryReference = mysqlTable(
  "accounting_supplier_industry_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingSupplierIndustryReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_supplier_industry_reference_id",
      }),
    };
  },
);

export const accountingSupplierItem = mysqlTable(
  "accounting_supplier_item",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    supplierId: bigint("supplier_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountingSupplier.id),
    name: varchar("name", { length: 255 }).notNull(),
    unitCost: double("unit_cost", { precision: 11, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingSupplierItemId: primaryKey({
        columns: [table.id],
        name: "accounting_supplier_item_id",
      }),
    };
  },
);

export const accountingSupplierTypeReference = mysqlTable(
  "accounting_supplier_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingSupplierTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_supplier_type_reference_id",
      }),
    };
  },
);

export const accountingTermsReference = mysqlTable(
  "accounting_terms_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingTermsReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_terms_reference_id",
      }),
    };
  },
);

export const accountingTransferBudget = mysqlTable(
  "accounting_transfer_budget",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    divisionIdFrom: bigint("division_id_from", {
      mode: "number",
      unsigned: true,
    }).references(() => division.id),
    divisionIdTo: bigint("division_id_to", {
      mode: "number",
      unsigned: true,
    }).references(() => division.id),
    budgetSourceIdFrom: bigint("budget_source_id_from", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingBudgetSource.id),
    budgetSourceIdTo: bigint("budget_source_id_to", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingBudgetSource.id),
    budgetChartIdFrom: bigint("budget_chart_id_from", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingBudgetChart.id),
    budgetChartIdTo: bigint("budget_chart_id_to", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingBudgetChart.id),
    budgetPlanIdTo: bigint("budget_plan_id_to", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingBudgetPlan.id),
    budgetPlanIdFrom: bigint("budget_plan_id_from", {
      mode: "number",
      unsigned: true,
    }).references(() => accountingBudgetPlan.id),
    transferTypeId: bigint("transfer_type_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => accountingTransferTypeReference.id),
    monthFrom: varchar("month_from", { length: 255 }),
    monthTo: varchar("month_to", { length: 255 }).notNull(),
    amount: double("amount", { precision: 11, scale: 2 }).notNull(),
    year: int("year"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingTransferBudgetId: primaryKey({
        columns: [table.id],
        name: "accounting_transfer_budget_id",
      }),
    };
  },
);

export const accountingTransferTypeReference = mysqlTable(
  "accounting_transfer_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingTransferTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_transfer_type_reference_id",
      }),
    };
  },
);

export const accountingTruckingTypeReference = mysqlTable(
  "accounting_trucking_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountingTruckingTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "accounting_trucking_type_reference_id",
      }),
    };
  },
);

export const acctngBankNameReference = mysqlTable(
  "acctng_bank_name_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngBankNameReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_bank_name_reference_id",
      }),
    };
  },
);

export const acctngBudgetAvailment = mysqlTable(
  "acctng_budget_availment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    requisitionId: bigint("requisition_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngPurchasing.id),
    budgetSubaccountId: bigint("budget_subaccount_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngBudgetManagement.id),
    requestAmount: double("request_amount", {
      precision: 8,
      scale: 2,
    }).notNull(),
    accountingSavings: double("accounting_savings", {
      precision: 8,
      scale: 2,
    }).notNull(),
    divisionSavings: double("division_savings", {
      precision: 8,
      scale: 2,
    }).notNull(),
    requestMonth: varchar("request_month", { length: 255 }).notNull(),
    year: int("year").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngBudgetAvailmentId: primaryKey({
        columns: [table.id],
        name: "acctng_budget_availment_id",
      }),
    };
  },
);

export const acctngBudgetCategoryReference = mysqlTable(
  "acctng_budget_category_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngBudgetCategoryReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_budget_category_reference_id",
      }),
      acctngBudgetCategoryReferenceNameUnique: unique(
        "acctng_budget_category_reference_name_unique",
      ).on(table.name),
    };
  },
);

export const acctngBudgetManagement = mysqlTable(
  "acctng_budget_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    subaccountName: varchar("subaccount_name", { length: 255 }),
    budgetSourceId: bigint("budget_source_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngBudgetSourceReference.id),
    budgetCategoryId: bigint("budget_category_id", {
      mode: "number",
      unsigned: true,
    }).references(() => acctngBudgetCategoryReference.id),
    budgetCoaId: bigint("budget_coa_id", {
      mode: "number",
      unsigned: true,
    }).references(() => acctngChartOfAccountsReference.id),
    budgetOpexId: bigint("budget_opex_id", {
      mode: "number",
      unsigned: true,
    }).references(() => acctngOpexCategoryReference.id),
    type: int("type").notNull(),
    year: int("year").notNull(),
    jan: double("jan").notNull(),
    feb: double("feb").notNull(),
    mar: double("mar").notNull(),
    apr: double("apr").notNull(),
    may: double("may").notNull(),
    jun: double("jun").notNull(),
    jul: double("jul").notNull(),
    aug: double("aug").notNull(),
    sep: double("sep").notNull(),
    oct: double("oct").notNull(),
    nov: double("nov").notNull(),
    dece: double("dece").notNull(),
    totalAmount: double("total_amount").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngBudgetManagementId: primaryKey({
        columns: [table.id],
        name: "acctng_budget_management_id",
      }),
    };
  },
);

export const acctngBudgetSourceReference = mysqlTable(
  "acctng_budget_source_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngBudgetSourceReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_budget_source_reference_id",
      }),
    };
  },
);

export const acctngBudgetTransfer = mysqlTable(
  "acctng_budget_transfer",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    sourceIdFrom: bigint("source_id_from", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngBudgetSourceReference.id),
    sourceIdTo: bigint("source_id_to", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngBudgetSourceReference.id),
    coaId: bigint("coa_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngBudgetManagement.id),
    coaFrom: bigint("coa_from", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngChartOfAccountsReference.id),
    coaTo: bigint("coa_to", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngChartOfAccountsReference.id),
    monthFrom: varchar("month_from", { length: 255 }).notNull(),
    monthTo: varchar("month_to", { length: 255 }).notNull(),
    year: int("year").notNull(),
    transferAmount: double("transfer_amount", {
      precision: 8,
      scale: 2,
    }).notNull(),
    transferType: int("transfer_type").notNull(),
    transferredBy: bigint("transferred_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngBudgetTransferId: primaryKey({
        columns: [table.id],
        name: "acctng_budget_transfer_id",
      }),
    };
  },
);

export const acctngChartOfAccountsReference = mysqlTable(
  "acctng_chart_of_accounts_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    accountCode: varchar("account_code", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngChartOfAccountsReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_chart_of_accounts_reference_id",
      }),
      acctngChartOfAccountsReferenceNameUnique: unique(
        "acctng_chart_of_accounts_reference_name_unique",
      ).on(table.name),
    };
  },
);

export const acctngIndustryReference = mysqlTable(
  "acctng_industry_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngIndustryReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_industry_reference_id",
      }),
    };
  },
);

export const acctngItemCategoryReference = mysqlTable(
  "acctng_item_category_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    isRecurring: tinyint("is_recurring").notNull(),
    budgetSourceId: bigint("budget_source_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngBudgetSourceReference.id),
    opexCategoryId: bigint("opex_category_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngOpexCategoryReference.id),
    chartOfAcccountsId: bigint("chart_of_acccounts_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngChartOfAccountsReference.id),
    subAccountsId: bigint("sub_accounts_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngSubAccountsReference.id),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngItemCategoryReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_item_category_reference_id",
      }),
    };
  },
);

export const acctngItemDescriptionReference = mysqlTable(
  "acctng_item_description_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    itemCategoryId: bigint("item_category_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngItemCategoryReference.id),
    description: varchar("description", { length: 255 }).notNull(),
    price: double("price", { precision: 8, scale: 2 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngItemDescriptionReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_item_description_reference_id",
      }),
    };
  },
);

export const acctngManpowerReference = mysqlTable(
  "acctng_manpower_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    emailAddress: varchar("email_address", { length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
    telNumber: varchar("tel_number", { length: 255 }),
    agency: varchar("agency", { length: 255 }).notNull(),
    tin: varchar("tin", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngManpowerReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_manpower_reference_id",
      }),
    };
  },
);

export const acctngOpexCategoryReference = mysqlTable(
  "acctng_opex_category_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    opexName: varchar("opex_name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngOpexCategoryReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_opex_category_reference_id",
      }),
    };
  },
);

export const acctngPriorityLevelReference = mysqlTable(
  "acctng_priority_level_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    dayMin: int("day_min").notNull(),
    dayMax: int("day_max").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngPriorityLevelReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_priority_level_reference_id",
      }),
    };
  },
);

export const acctngPurchasing = mysqlTable(
  "acctng_purchasing",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    referenceNo: varchar("reference_no", { length: 255 }).notNull(),
    priorityLevelId: bigint("priority_level_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngPriorityLevelReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    expectedReqStartDate: date("expected_req_start_date", { mode: "string" }),
    serviceCategoryId: bigint("service_category_id", {
      mode: "number",
      unsigned: true,
    }).references(() => acctngServiceCategoryReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    expectedPurchaseDeliveryDate: date("expected_purchase_delivery_date", {
      mode: "string",
    }),
    purchasingTypeId: bigint("purchasing_type_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngPurchasingTypeReference.id),
    requisitionFinalStatus: int("requisition_final_status").notNull(),
    canvassingFinalStatus: int("canvassing_final_status").notNull(),
    requestFinalStatus: int("request_final_status").notNull(),
    orderFinalStatus: int("order_final_status").notNull(),
    rfpFinalStatus: int("rfp_final_status").notNull(),
    checkVoucherFinalStatus: int("check_voucher_final_status").notNull(),
    requisitionStatusUpdateDate: datetime("requisition_status_update_date", {
      mode: "string",
    }).notNull(),
    canvassingStatusUpdateDate: datetime("canvassing_status_update_date", {
      mode: "string",
    }).notNull(),
    requestStatusUpdateDate: datetime("request_status_update_date", {
      mode: "string",
    }).notNull(),
    orderStatusUpdateDate: datetime("order_status_update_date", {
      mode: "string",
    }).notNull(),
    rfpStatusUpdateDate: datetime("rfp_status_update_date", {
      mode: "string",
    }).notNull(),
    checkVoucherStatusUpdateDate: datetime("check_voucher_status_update_date", {
      mode: "string",
    }).notNull(),
    budgetId: bigint("budget_id", {
      mode: "number",
      unsigned: true,
    }).references(() => acctngSubAccountsReference.id),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngPurchasingId: primaryKey({
        columns: [table.id],
        name: "acctng_purchasing_id",
      }),
    };
  },
);

export const acctngPurchasingLoaManagement = mysqlTable(
  "acctng_purchasing_loa_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    purchasingTypeId: bigint("purchasing_type_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngPurchasingTypeReference.id),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngBudgetSourceReference.id),
    minAmount: double("min_amount").notNull(),
    maxAmount: double("max_amount").notNull(),
    approval1Id: bigint("approval1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approval2Id: bigint("approval2_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approval3Id: bigint("approval3_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngPurchasingLoaManagementId: primaryKey({
        columns: [table.id],
        name: "acctng_purchasing_loa_management_id",
      }),
    };
  },
);

export const acctngPurchasingPurchaseReqAtta = mysqlTable(
  "acctng_purchasing_purchase_req_atta",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    referenceNoId: bigint("reference_no_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngPurchasing.id),
    purchaseReqId: bigint("purchase_req_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngPurchasingPurchaseReqDetails.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngPurchasingPurchaseReqAttaId: primaryKey({
        columns: [table.id],
        name: "acctng_purchasing_purchase_req_atta_id",
      }),
    };
  },
);

export const acctngPurchasingPurchaseReqDetails = mysqlTable(
  "acctng_purchasing_purchase_req_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    referenceNoId: bigint("reference_no_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngPurchasing.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    deliveryDate: date("delivery_date", { mode: "string" }).notNull(),
    isSampleProduct: tinyint("is_sample_product"),
    itemCategoryId: bigint("item_category_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    itemDescriptionId: bigint("item_description_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    qty: int("qty").notNull(),
    unit: int("unit").notNull(),
    estimatedRate: double("estimated_rate", {
      precision: 8,
      scale: 2,
    }).notNull(),
    estimatedTotal: double("estimated_total", {
      precision: 8,
      scale: 2,
    }).notNull(),
    preferredSupplierId: bigint("preferred_supplier_id", {
      mode: "number",
      unsigned: true,
    }),
    purpose: bigint("purpose", { mode: "number", unsigned: true }),
    beneficiaryBranchId: bigint("beneficiary_branch_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    seriesStartNo: varchar("series_start_no", { length: 255 }),
    seriesEndNo: varchar("series_end_no", { length: 255 }),
    remarks: longtext("remarks"),
    budgetId: bigint("budget_id", { mode: "number", unsigned: true }).notNull(),
    reasonId: bigint("reason_id", { mode: "number", unsigned: true }),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true }),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true }),
    approver3Id: bigint("approver3_id", { mode: "number", unsigned: true }),
    approver1Status: int("approver1_status"),
    approver2Status: int("approver2_status"),
    approver3Status: int("approver3_status"),
    approver1Date: datetime("approver1_date", { mode: "string" }),
    approver2Date: datetime("approver2_date", { mode: "string" }),
    approver3Date: datetime("approver3_date", { mode: "string" }),
    approver1Remarks: longtext("approver1_remarks"),
    approver2Remarks: longtext("approver2_remarks"),
    approver3Remarks: longtext("approver3_remarks"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    approver4Id: int("approver4_id"),
    approver5Id: int("approver5_id"),
    approver4Status: int("approver4_status"),
    approver5Status: int("approver5_status"),
    approver4Date: datetime("approver4_date", { mode: "string" }),
    approver5Date: datetime("approver5_date", { mode: "string" }),
    approver4Remarks: longtext("approver4_remarks"),
    approver5Remarks: longtext("approver5_remarks"),
  },
  (table) => {
    return {
      acctngPurchasingPurchaseReqDetailsId: primaryKey({
        columns: [table.id],
        name: "acctng_purchasing_purchase_req_details_id",
      }),
    };
  },
);

export const acctngPurchasingServiceReqAttachment = mysqlTable(
  "acctng_purchasing_service_req_attachment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    referenceNoId: bigint("reference_no_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngPurchasing.id),
    serviceReqId: bigint("service_req_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngPurchasingServiceReqDetails.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngPurchasingServiceReqAttachmentId: primaryKey({
        columns: [table.id],
        name: "acctng_purchasing_service_req_attachment_id",
      }),
    };
  },
);

export const acctngPurchasingServiceReqDetails = mysqlTable(
  "acctng_purchasing_service_req_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    referenceNoId: bigint("reference_no_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngPurchasing.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    expectedStartDate: date("expected_start_date", {
      mode: "string",
    }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    expectedEndDate: date("expected_end_date", { mode: "string" }).notNull(),
    serviceCategoryId: bigint("service_category_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngServiceCategoryReference.id),
    serviceDescriptionId: bigint("service_description_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngServiceDescriptionReference.id),
    numberOfWorkers: int("number_of_workers").notNull(),
    manHours: int("man_hours").notNull(),
    estimatedRate: double("estimated_rate", {
      precision: 8,
      scale: 2,
    }).notNull(),
    preferredWorker: bigint("preferred_worker", {
      mode: "number",
      unsigned: true,
    }).references(() => acctngManpowerReference.id),
    purpose: bigint("purpose", { mode: "number", unsigned: true }).references(
      () => acctngPurposeReference.id,
    ),
    locationId: bigint("location_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsBranchReference.id),
    reasonId: bigint("reason_id", {
      mode: "number",
      unsigned: true,
    }).references(() => acctngReasonForRejectionReference.id),
    comments: longtext("comments"),
    budgetId: bigint("budget_id", {
      mode: "number",
      unsigned: true,
    }).references(() => acctngBudgetManagement.id),
    approver1Id: bigint("approver1_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    approver2Id: bigint("approver2_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    approver3Id: bigint("approver3_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    approver1Status: bigint("approver1_status", {
      mode: "number",
      unsigned: true,
    }),
    approver2Status: bigint("approver2_status", {
      mode: "number",
      unsigned: true,
    }),
    approver3Status: bigint("approver3_status", {
      mode: "number",
      unsigned: true,
    }),
    approver1Date: datetime("approver1_date", { mode: "string" }),
    approver2Date: datetime("approver2_date", { mode: "string" }),
    approver3Date: datetime("approver3_date", { mode: "string" }),
    approver1Remarks: longtext("approver1_remarks"),
    approver2Remarks: longtext("approver2_remarks"),
    approver3Remarks: longtext("approver3_remarks"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    approver4Id: int("approver4_id"),
    approver5Id: int("approver5_id"),
    approver4Status: int("approver4_status"),
    approver5Status: int("approver5_status"),
    approver4Date: datetime("approver4_date", { mode: "string" }),
    approver5Date: datetime("approver5_date", { mode: "string" }),
    approver4Remarks: longtext("approver4_remarks"),
    approver5Remarks: longtext("approver5_remarks"),
  },
  (table) => {
    return {
      acctngPurchasingServiceReqDetailsId: primaryKey({
        columns: [table.id],
        name: "acctng_purchasing_service_req_details_id",
      }),
    };
  },
);

export const acctngPurchasingTypeReference = mysqlTable(
  "acctng_purchasing_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngPurchasingTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_purchasing_type_reference_id",
      }),
    };
  },
);

export const acctngPurposeReference = mysqlTable(
  "acctng_purpose_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngPurposeReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_purpose_reference_id",
      }),
    };
  },
);

export const acctngReasonForRejectionReference = mysqlTable(
  "acctng_reason_for_rejection_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngReasonForRejectionReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_reason_for_rejection_reference_id",
      }),
    };
  },
);

export const acctngServiceCategoryReference = mysqlTable(
  "acctng_service_category_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    isRecurring: tinyint("is_recurring"),
    budgetSourceId: bigint("budget_source_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngBudgetSourceReference.id),
    opexCategoryId: bigint("opex_category_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngOpexCategoryReference.id),
    chartOfAcccountsId: bigint("chart_of_acccounts_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngChartOfAccountsReference.id),
    subAccountsId: bigint("sub_accounts_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngSubAccountsReference.id),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngServiceCategoryReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_service_category_reference_id",
      }),
    };
  },
);

export const acctngServiceDescriptionReference = mysqlTable(
  "acctng_service_description_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    serviceCategoryId: bigint("service_category_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => acctngServiceCategoryReference.id),
    description: varchar("description", { length: 255 }).notNull(),
    price: double("price", { precision: 8, scale: 2 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngServiceDescriptionReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_service_description_reference_id",
      }),
    };
  },
);

export const acctngSubAccountsReference = mysqlTable(
  "acctng_sub_accounts_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    accountCode: varchar("account_code", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngSubAccountsReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_sub_accounts_reference_id",
      }),
    };
  },
);

export const acctngSupplier = mysqlTable(
  "acctng_supplier",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    tradeName: varchar("trade_name", { length: 255 }).notNull(),
    tin: int("tin").notNull(),
    industryId: bigint("industry_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngIndustryReference.id),
    regionId: bigint("region_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => region.id),
    provinceId: bigint("province_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => state.id),
    municipalId: bigint("municipal_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => city.id),
    barangayId: bigint("barangay_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => barangay.id),
    postalCode: varchar("postal_code", { length: 255 }).notNull(),
    address: longtext("address").notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    emailAddress: varchar("email_address", { length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
    telNumber: varchar("tel_number", { length: 255 }),
    payeeName: varchar("payee_name", { length: 255 }).notNull(),
    payeeAccountNumber: varchar("payee_account_number", {
      length: 255,
    }).notNull(),
    bankAccountNumber: varchar("bank_account_number", {
      length: 255,
    }).notNull(),
    bankAccountName: varchar("bank_account_name", { length: 255 }).notNull(),
    bankId: bigint("bank_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => acctngBankNameReference.id),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngSupplierId: primaryKey({
        columns: [table.id],
        name: "acctng_supplier_id",
      }),
    };
  },
);

export const acctngUnitReference = mysqlTable(
  "acctng_unit_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      acctngUnitReferenceId: primaryKey({
        columns: [table.id],
        name: "acctng_unit_reference_id",
      }),
    };
  },
);

export const areaReference = mysqlTable(
  "area_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    region: int("region").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      areaReferenceId: primaryKey({
        columns: [table.id],
        name: "area_reference_id",
      }),
    };
  },
);

export const barangay = mysqlTable(
  "barangay",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    stateId: bigint("state_id", { mode: "number", unsigned: true }).references(
      () => state.id,
    ),
    cityId: bigint("city_id", { mode: "number", unsigned: true }).references(
      () => city.id,
    ),
    zipcodeId: bigint("zipcode_id", {
      mode: "number",
      unsigned: true,
    }).references(() => oimsZipcodeReference.id),
    regionId: bigint("region_id", {
      mode: "number",
      unsigned: true,
    }).references(() => region.id),
    islandGroupId: bigint("island_group_id", {
      mode: "number",
      unsigned: true,
    }).references(() => islandGroup.id),
    status: int("status"),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    regCode: int("regCode"),
    brgyCode: int("brgyCode"),
  },
  (table) => {
    return {
      cityIdForeign: index("barangay_city_id_foreign").on(table.cityId),
      islandGroupIdForeign: index("barangay_island_group_id_foreign").on(
        table.islandGroupId,
      ),
      regionIdForeign: index("barangay_region_id_foreign").on(table.regionId),
      stateIdForeign: index("barangay_state_id_foreign").on(table.stateId),
      zipcodeIdForeign: index("barangay_zipcode_id_foreign").on(
        table.zipcodeId,
      ),
      barangayId: primaryKey({ columns: [table.id], name: "barangay_id" }),
    };
  },
);

export const branchReference = mysqlTable(
  "branch_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    areaId: int("area_id"),
    areaTypeId: bigint("area_type_id", { mode: "number", unsigned: true }),
    areaLevelId: bigint("area_level_id", { mode: "number", unsigned: true }),
    areaDestinationId: bigint("area_destination_id", {
      mode: "number",
      unsigned: true,
    }),
    areaBoxDestinationId: bigint("area_box_destination_id", {
      mode: "number",
      unsigned: true,
    }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      branchReferenceId: primaryKey({
        columns: [table.id],
        name: "branch_reference_id",
      }),
    };
  },
);

export const branchReferencesQuadrant = mysqlTable(
  "branch_references_quadrant",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    branchReferenceId: bigint("branch_reference_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmStakeholderSearchManagementReference.id),
    quadrant: int("quadrant").notNull(),
    status: varchar("status", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      branchReferencesQuadrantId: primaryKey({
        columns: [table.id],
        name: "branch_references_quadrant_id",
      }),
    };
  },
);

export const branchReferencesWalkin = mysqlTable(
  "branch_references_walkin",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    branchReferenceId: bigint("branch_reference_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmStakeholderSearchManagementReference.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      branchReferencesWalkinId: primaryKey({
        columns: [table.id],
        name: "branch_references_walkin_id",
      }),
    };
  },
);

export const chargesManagement = mysqlTable(
  "charges_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rateCalcuCharges: varchar("rate_calcu_charges", { length: 255 }).notNull(),
    chargesCategory: int("charges_category").notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      chargesManagementId: primaryKey({
        columns: [table.id],
        name: "charges_management_id",
      }),
    };
  },
);

export const checkMobiVerifications = mysqlTable(
  "check_mobi_verifications",
  {
    id: varchar("id", { length: 100 }).notNull(),
    number: varchar("number", { length: 30 }).notNull(),
    cc: varchar("cc", { length: 6 }).notNull(),
    type: varchar("type", { length: 30 }).notNull(),
    cliPrefix: varchar("cli_prefix", { length: 30 }),
    validated: tinyint("validated").default(0).notNull(),
    retryAt: datetime("retry_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      checkMobiVerificationsIdUnique: unique(
        "check_mobi_verifications_id_unique",
      ).on(table.id),
    };
  },
);

export const checkmobiColumn = mysqlTable(
  "checkmobi_column",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    des: longtext("des").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    number: varchar("number", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      checkmobiColumnId: primaryKey({
        columns: [table.id],
        name: "checkmobi_column_id",
      }),
    };
  },
);

export const city = mysqlTable(
  "city",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    cityPostal: varchar("city_postal", { length: 255 }),
    stateId: bigint("state_id", { mode: "number", unsigned: true }).references(
      () => state.id,
    ),
    regionId: bigint("region_id", {
      mode: "number",
      unsigned: true,
    }).references(() => region.id),
    islandGroupId: bigint("island_group_id", {
      mode: "number",
      unsigned: true,
    }).references(() => islandGroup.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    psgcCode: int("psgcCode"),
    regDesc: int("regDesc"),
    citymunCode: int("citymunCode"),
    status: int("status"),
  },
  (table) => {
    return {
      islandGroupIdForeign: index("city_island_group_id_foreign").on(
        table.islandGroupId,
      ),
      regionIdForeign: index("city_region_id_foreign").on(table.regionId),
      stateIdForeign: index("city_state_id_foreign").on(table.stateId),
      cityId: primaryKey({ columns: [table.id], name: "city_id" }),
    };
  },
);

export const crmAccountApplicationAttachment = mysqlTable(
  "crm_account_application_attachment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    accountInfoId: bigint("account_info_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmCustomerInformation.id),
    applicationRequirementId: bigint("application_requirement_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAccountApplicationAttachmentId: primaryKey({
        columns: [table.id],
        name: "crm_account_application_attachment_id",
      }),
    };
  },
);

export const crmAccountType = mysqlTable(
  "crm_account_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAccountTypeId: primaryKey({
        columns: [table.id],
        name: "crm_account_type_id",
      }),
    };
  },
);

export const crmAccountType2 = mysqlTable(
  "crm_account_type_2",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAccountType2Id: primaryKey({
        columns: [table.id],
        name: "crm_account_type_2_id",
      }),
    };
  },
);

export const crmActivities = mysqlTable(
  "crm_activities",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    employeeId: int("employee_id").notNull(),
    activityTypeId: int("activity_type_id").notNull(),
    accountId: int("account_id").notNull(),
    description: longtext("description"),
    srNo: varchar("sr_no", { length: 255 }),
    quotationReferenceNo: varchar("quotation_reference_no", { length: 255 }),
    status: int("status").notNull(),
    datetimeCompleted: datetime("datetime_completed", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmActivitiesId: primaryKey({
        columns: [table.id],
        name: "crm_activities_id",
      }),
    };
  },
);

export const crmActivitiesReferences = mysqlTable(
  "crm_activities_references",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmActivitiesReferencesId: primaryKey({
        columns: [table.id],
        name: "crm_activities_references_id",
      }),
    };
  },
);

export const crmActivityLogAMeeting = mysqlTable(
  "crm_activity_log_a_meeting",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    customerId: bigint("customer_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmCustomerInformation.id),
    outcomeId: bigint("outcome_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    datetime: datetime("datetime", { mode: "string" }).notNull(),
    meetingTime: time("meeting_time").notNull(),
    notes: longtext("notes").notNull(),
    srNo: varchar("sr_no", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmActivityLogAMeetingId: primaryKey({
        columns: [table.id],
        name: "crm_activity_log_a_meeting_id",
      }),
    };
  },
);

export const crmActivityLogAMeetingAttendees = mysqlTable(
  "crm_activity_log_a_meeting_attendees",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    attendeesId: bigint("attendees_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    meetingId: bigint("meeting_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmActivityLogAMeeting.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmActivityLogAMeetingAttendeesId: primaryKey({
        columns: [table.id],
        name: "crm_activity_log_a_meeting_attendees_id",
      }),
    };
  },
);

export const crmActivityNotes = mysqlTable(
  "crm_activity_notes",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    customerId: int("customer_id").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    note: longtext("note").notNull(),
    srNo: varchar("sr_no", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmActivityNotesId: primaryKey({
        columns: [table.id],
        name: "crm_activity_notes_id",
      }),
    };
  },
);

export const crmActivityTask = mysqlTable(
  "crm_activity_task",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    customerId: int("customer_id").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    priority: int("priority").notNull(),
    dueDate: datetime("due_date", { mode: "string" }).notNull(),
    task: longtext("task").notNull(),
    completedDate: datetime("completed_date", { mode: "string" }),
    srNo: varchar("sr_no", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmActivityTaskId: primaryKey({
        columns: [table.id],
        name: "crm_activity_task_id",
      }),
    };
  },
);

export const crmActivityTypeDeliveryReference = mysqlTable(
  "crm_activity_type_delivery_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    time: bigint("time", { mode: "number", unsigned: true }).notNull(),
    unitTime: varchar("unit_time", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmActivityTypeDeliveryReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_activity_type_delivery_reference_id",
      }),
    };
  },
);

export const crmActivityTypeManagement = mysqlTable(
  "crm_activity_type_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    activityType: varchar("activity_type", { length: 255 }).notNull(),
    pickupExecutionTimeId: bigint("pickup_execution_time_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmActivityTypePickupReference.id),
    deliveryExecutionTimeId: bigint("delivery_execution_time_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmActivityTypeDeliveryReference.id),
    status: int("status", { unsigned: true }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmActivityTypeManagementId: primaryKey({
        columns: [table.id],
        name: "crm_activity_type_management_id",
      }),
    };
  },
);

export const crmActivityTypePickupReference = mysqlTable(
  "crm_activity_type_pickup_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    time: bigint("time", { mode: "number", unsigned: true }).notNull(),
    unitTime: varchar("unit_time", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmActivityTypePickupReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_activity_type_pickup_reference_id",
      }),
    };
  },
);

export const crmAddressLabel = mysqlTable(
  "crm_address_label",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAddressLabelId: primaryKey({
        columns: [table.id],
        name: "crm_address_label_id",
      }),
    };
  },
);

export const crmAddressList = mysqlTable(
  "crm_address_list",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    accountType: int("account_type").notNull(),
    accountId: int("account_id").notNull(),
    addressLine1: longtext("address_line_1").notNull(),
    addressLine2: varchar("address_line_2", { length: 255 }),
    addressType: int("address_type").notNull(),
    addressLabel: int("address_label").notNull(),
    stateId: int("state_id").notNull(),
    cityId: int("city_id").notNull(),
    barangayId: int("barangay_id"),
    countryId: int("country_id"),
    postalId: int("postal_id").notNull(),
    isPrimary: tinyint("is_primary").default(0).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAddressListId: primaryKey({
        columns: [table.id],
        name: "crm_address_list_id",
      }),
    };
  },
);

export const crmAncillaryChargeReference = mysqlTable(
  "crm_ancillary_charge_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAncillaryChargeReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_ancillary_charge_reference_id",
      }),
    };
  },
);

export const crmAncillaryDisplayDetails = mysqlTable(
  "crm_ancillary_display_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    ancillaryDisplayId: bigint("ancillary_display_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmAncillaryDisplayManagement.id),
    ancillaryChargeId: bigint("ancillary_charge_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmAncillaryManagement.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAncillaryDisplayDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_ancillary_display_details_id",
      }),
    };
  },
);

export const crmAncillaryDisplayManagement = mysqlTable(
  "crm_ancillary_display_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAncillaryDisplayManagementId: primaryKey({
        columns: [table.id],
        name: "crm_ancillary_display_management_id",
      }),
    };
  },
);

export const crmAncillaryManagement = mysqlTable(
  "crm_ancillary_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    chargesAmount: double("charges_amount", { precision: 8, scale: 2 }),
    chargesRate: double("charges_rate"),
    description: longtext("description"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    status: int("status").notNull(),
    teChargeId: bigint("te_charge_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmAncillaryChargeReference.id),
  },
  (table) => {
    return {
      crmAncillaryManagementId: primaryKey({
        columns: [table.id],
        name: "crm_ancillary_management_id",
      }),
    };
  },
);

export const crmApplicationRequirements = mysqlTable(
  "crm_application_requirements",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmApplicationRequirementsId: primaryKey({
        columns: [table.id],
        name: "crm_application_requirements_id",
      }),
    };
  },
);

export const crmApprovalReference = mysqlTable(
  "crm_approval_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmApprovalReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_approval_reference_id",
      }),
    };
  },
);

export const crmAudienceSegmentManagement = mysqlTable(
  "crm_audience_segment_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    filterId: int("filter_id").notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    onboardedDateFrom: date("onboarded_date_from", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    onboardedDateTo: date("onboarded_date_to", { mode: "string" }),
    statusId: int("status_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAudienceSegmentManagementId: primaryKey({
        columns: [table.id],
        name: "crm_audience_segment_management_id",
      }),
    };
  },
);

export const crmAudienceSegmentManagementCriteria = mysqlTable(
  "crm_audience_segment_management_criteria",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    audienceId: bigint("audience_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmAudienceSegmentManagement.id),
    criteriaId: int("criteria_id"),
    criteriaName: varchar("criteria_name", { length: 255 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    onboardedDateFrom: date("onboarded_date_from", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    onboardedDateTo: date("onboarded_date_to", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmAudienceSegmentManagementCriteriaId: primaryKey({
        columns: [table.id],
        name: "crm_audience_segment_management_criteria_id",
      }),
    };
  },
);

export const crmBooking = mysqlTable(
  "crm_booking",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    bookingReferenceNo: varchar("booking_reference_no", {
      length: 255,
    }).notNull(),
    bookingTypeId: bigint("booking_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBookingTypeReference.id),
    vehicleTypeId: bigint("vehicle_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmVehicleTypeReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    pickupDate: date("pickup_date", { mode: "string" }).notNull(),
    timeSlotId: bigint("time_slot_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmTimeslot.id),
    timeSlotFrom: time("time_slot_from"),
    timeSlotTo: time("time_slot_to"),
    bookingCategory: bigint("booking_category", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    walkInBranchId: bigint("walk_in_branch_id", {
      mode: "number",
      unsigned: true,
    }).references(() => branchReference.id),
    activityType: bigint("activity_type", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmActivityTypeManagement.id),
    shipperId: bigint("shipper_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmCustomerInformation.id),
    shipperCustomerNo: varchar("shipper_customer_no", {
      length: 255,
    }).notNull(),
    consigneeCategory: bigint("consignee_category", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    consigneeCount: bigint("consignee_count", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    workInstruction: longtext("work_instruction"),
    remarks: longtext("remarks"),
    assignedTeamId: bigint("assigned_team_id", {
      mode: "number",
      unsigned: true,
    }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBookingStatusReference.id),
    bookingBranchId: bigint("booking_branch_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => branchReference.id),
    marketingChannelId: bigint("marketing_channel_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmMarketingChannel.id),
    bookingChannel: bigint("booking_channel", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateApplyForReference.id),
    approvalStatus: bigint("approval_status", {
      mode: "number",
      unsigned: true,
    }),
    createdUser: bigint("created_user", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    vipCreatedUser: bigint("vip_created_user", {
      mode: "number",
      unsigned: true,
    }),
    isVipPortal: int("is_vip_portal"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingId: primaryKey({ columns: [table.id], name: "crm_booking_id" }),
    };
  },
);

export const crmBookingCargoDetails = mysqlTable(
  "crm_booking_cargo_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    consigneeId: bigint("consignee_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmBookingConsignee.id),
    quantity: bigint("quantity", { mode: "number", unsigned: true }),
    weight: bigint("weight", { mode: "number", unsigned: true }),
    length: bigint("length", { mode: "number", unsigned: true }),
    width: bigint("width", { mode: "number", unsigned: true }),
    height: bigint("height", { mode: "number", unsigned: true }),
    size: bigint("size", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingCargoDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_booking_cargo_details_id",
      }),
    };
  },
);

export const crmBookingConsignee = mysqlTable(
  "crm_booking_consignee",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    bookingId: bigint("booking_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBooking.id),
    customerNo: varchar("customer_no", { length: 255 }).notNull(),
    accountTypeId: bigint("account_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmAccountType.id),
    companyName: varchar("company_name", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
    emailAddress: varchar("email_address", { length: 255 }).notNull(),
    address: longtext("address").notNull(),
    declaredValue: double("declared_value").notNull(),
    transposrtModeId: bigint("transposrt_mode_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateTransportModeReference.id),
    serviceModeId: bigint("service_mode_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmServiceModeReference.id),
    descriptionGoods: longtext("description_goods").notNull(),
    modeOfPaymentId: bigint("mode_of_payment_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmModeOfPaymentReference.id),
    servicesTypeId: int("services_type_id"),
    chargeToId: int("charge_to_id", { unsigned: true }),
    chargeToName: varchar("charge_to_name", { length: 255 }),
    stateId: bigint("state_id", { mode: "number", unsigned: true }).notNull(),
    cityId: bigint("city_id", { mode: "number", unsigned: true }).notNull(),
    barangayId: bigint("barangay_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    postalId: bigint("postal_id", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingConsigneeId: primaryKey({
        columns: [table.id],
        name: "crm_booking_consignee_id",
      }),
    };
  },
);

export const crmBookingFailedReasonReference = mysqlTable(
  "crm_booking_failed_reason_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingFailedReasonReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_booking_failed_reason_reference_id",
      }),
    };
  },
);

export const crmBookingHistory = mysqlTable(
  "crm_booking_history",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    bookingReferenceNo: varchar("booking_reference_no", {
      length: 255,
    }).notNull(),
    bookingTypeId: bigint("booking_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBookingTypeReference.id),
    vehicleTypeId: bigint("vehicle_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmVehicleTypeReference.id),
    pickupDate: datetime("pickup_date", { mode: "string" }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    bookingDate: date("booking_date", { mode: "string" }).notNull(),
    timeSlotId: bigint("time_slot_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmTimeslot.id),
    bookingCategory: bigint("booking_category", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    walkInBranchId: bigint("walk_in_branch_id", {
      mode: "number",
      unsigned: true,
    }).references(() => branchReference.id),
    activityType: bigint("activity_type", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmActivityTypeManagement.id),
    shipperId: bigint("shipper_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmCustomerInformation.id),
    shipperCustomerNo: varchar("shipper_customer_no", {
      length: 255,
    }).notNull(),
    consigneeCategory: bigint("consignee_category", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    consigneeCount: bigint("consignee_count", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    workInstruction: longtext("work_instruction"),
    remarks: longtext("remarks"),
    assignedTeamId: bigint("assigned_team_id", {
      mode: "number",
      unsigned: true,
    }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBookingStatusReference.id),
    bookingBranchId: bigint("booking_branch_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => branchReference.id),
    marketingChannelId: bigint("marketing_channel_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmMarketingChannel.id),
    bookingChannel: bigint("booking_channel", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateApplyForReference.id),
    approvalStatus: bigint("approval_status", {
      mode: "number",
      unsigned: true,
    }),
    completedDate: datetime("completed_date", { mode: "string" }),
    createdUser: bigint("created_user", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingHistoryId: primaryKey({
        columns: [table.id],
        name: "crm_booking_history_id",
      }),
    };
  },
);

export const crmBookingLogs = mysqlTable(
  "crm_booking_logs",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    bookingId: bigint("booking_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBooking.id),
    bookingReferenceNo: varchar("booking_reference_no", {
      length: 255,
    }).notNull(),
    statusId: bigint("status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBookingStatusReference.id),
    cancelReason: bigint("cancel_reason", {
      mode: "number",
      unsigned: true,
    }).references(() => crmBookingFailedReasonReference.id),
    reschedReason: bigint("resched_reason", {
      mode: "number",
      unsigned: true,
    }).references(() => crmBookingFailedReasonReference.id),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approveUserId: bigint("approve_user_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    approveDate: datetime("approve_date", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingLogsId: primaryKey({
        columns: [table.id],
        name: "crm_booking_logs_id",
      }),
    };
  },
);

export const crmBookingRemarks = mysqlTable(
  "crm_booking_remarks",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    bookingId: bigint("booking_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBooking.id),
    bookingReferenceNo: varchar("booking_reference_no", {
      length: 255,
    }).notNull(),
    remarks: longtext("remarks"),
    statusId: bigint("status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBookingStatusReference.id),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingRemarksId: primaryKey({
        columns: [table.id],
        name: "crm_booking_remarks_id",
      }),
    };
  },
);

export const crmBookingShipper = mysqlTable(
  "crm_booking_shipper",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    bookingId: bigint("booking_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBooking.id),
    customerNo: varchar("customer_no", { length: 255 }).notNull(),
    accountTypeId: bigint("account_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmAccountType.id),
    companyName: varchar("company_name", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
    emailAddress: varchar("email_address", { length: 255 }).notNull(),
    address: longtext("address").notNull(),
    stateId: bigint("state_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => state.id),
    cityId: bigint("city_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => city.id),
    barangayId: bigint("barangay_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    postalId: bigint("postal_id", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingShipperId: primaryKey({
        columns: [table.id],
        name: "crm_booking_shipper_id",
      }),
    };
  },
);

export const crmBookingStatusReference = mysqlTable(
  "crm_booking_status_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingStatusReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_booking_status_reference_id",
      }),
    };
  },
);

export const crmBookingTypeReference = mysqlTable(
  "crm_booking_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_booking_type_reference_id",
      }),
    };
  },
);

export const crmBookingWorkInstructionAttachment = mysqlTable(
  "crm_booking_work_instruction_attachment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    bookingId: bigint("booking_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBooking.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmBookingWorkInstructionAttachmentId: primaryKey({
        columns: [table.id],
        name: "crm_booking_work_instruction_attachment_id",
      }),
    };
  },
);

export const crmChannelSrSource = mysqlTable(
  "crm_channel_sr_source",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmChannelSrSourceId: primaryKey({
        columns: [table.id],
        name: "crm_channel_sr_source_id",
      }),
    };
  },
);

export const crmCommodityTypeReference = mysqlTable(
  "crm_commodity_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmCommodityTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_commodity_type_reference_id",
      }),
    };
  },
);

export const crmContactPerson = mysqlTable(
  "crm_contact_person",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    accountId: int("account_id").notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    position: varchar("position", { length: 255 }).notNull(),
    isPrimary: tinyint("is_primary").default(0).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmContactPersonId: primaryKey({
        columns: [table.id],
        name: "crm_contact_person_id",
      }),
    };
  },
);

export const crmCountry = mysqlTable(
  "crm_country",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmCountryId: primaryKey({ columns: [table.id], name: "crm_country_id" }),
    };
  },
);

export const crmCratingTypeReference = mysqlTable(
  "crm_crating_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmCratingTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_crating_type_reference_id",
      }),
    };
  },
);

export const crmCustomerInformation = mysqlTable(
  "crm_customer_information",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    accountType: bigint("account_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    accountNo: varchar("account_no", { length: 255 }),
    fullname: varchar("fullname", { length: 255 }),
    companyName: varchar("company_name", { length: 255 }),
    firstName: varchar("first_name", { length: 255 }),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    companyLink: varchar("company_link", { length: 255 }),
    companyEmailAddress: varchar("company_email_address", { length: 255 }),
    companyTelNo: int("company_tel_no"),
    companyMobileNo: int("company_mobile_no"),
    industryId: bigint("industry_id", { mode: "number", unsigned: true }),
    lifeStageId: bigint("life_stage_id", { mode: "number", unsigned: true }),
    isMotherAccount: tinyint("is_mother_account").default(0),
    childAccountId: bigint("child_account_id", {
      mode: "number",
      unsigned: true,
    }),
    contactOwnerId: bigint("contact_owner_id", {
      mode: "number",
      unsigned: true,
    }),
    tin: varchar("tin", { length: 255 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    companyAnniversary: date("company_anniversary", { mode: "string" }),
    marketingChannelId: bigint("marketing_channel_id", {
      mode: "number",
      unsigned: true,
    }),
    onboardingId: bigint("onboarding_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    notes: longtext("notes"),
    customerType: tinyint("customer_type").default(1),
    status: bigint("status", { mode: "number", unsigned: true }).default(1),
    createdBy: bigint("created_by", { mode: "number", unsigned: true }),
    approvalDate: datetime("approval_date", { mode: "string" }),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true }),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true }),
    approver3Id: bigint("approver3_id", { mode: "number", unsigned: true }),
    approver4Id: bigint("approver4_id", { mode: "number", unsigned: true }),
    approver1Status: bigint("approver1_status", {
      mode: "number",
      unsigned: true,
    }),
    approver2Status: bigint("approver2_status", {
      mode: "number",
      unsigned: true,
    }),
    approver3Status: bigint("approver3_status", {
      mode: "number",
      unsigned: true,
    }),
    approver4Status: bigint("approver4_status", {
      mode: "number",
      unsigned: true,
    }),
    approver1Remarks: bigint("approver1_remarks", {
      mode: "number",
      unsigned: true,
    }),
    approver2Remarks: bigint("approver2_remarks", {
      mode: "number",
      unsigned: true,
    }),
    approver3Remarks: bigint("approver3_remarks", {
      mode: "number",
      unsigned: true,
    }),
    approver4Remarks: bigint("approver4_remarks", {
      mode: "number",
      unsigned: true,
    }),
    approver1Date: datetime("approver1_date", { mode: "string" }),
    approver2Date: datetime("approver2_date", { mode: "string" }),
    approver3Date: datetime("approver3_date", { mode: "string" }),
    approver4Date: datetime("approver4_date", { mode: "string" }),
    finalStatus: bigint("final_status", { mode: "number", unsigned: true }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    rateName: varchar("rate_name", { length: 255 }),
  },
  (table) => {
    return {
      crmCustomerInformationId: primaryKey({
        columns: [table.id],
        name: "crm_customer_information_id",
      }),
    };
  },
);

export const crmCustomerInformationInitiatedCall = mysqlTable(
  "crm_customer_information_initiated_call",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    customerNumber: varchar("customer_number", { length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
    callSid: varchar("CallSid", { length: 255 }).notNull(),
    callStatus: varchar("CallStatus", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmCustomerInformationInitiatedCallId: primaryKey({
        columns: [table.id],
        name: "crm_customer_information_initiated_call_id",
      }),
    };
  },
);

export const crmCustomerStatusReferences = mysqlTable(
  "crm_customer_status_references",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmCustomerStatusReferencesId: primaryKey({
        columns: [table.id],
        name: "crm_customer_status_references_id",
      }),
    };
  },
);

export const crmEmailAddressList = mysqlTable(
  "crm_email_address_list",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    contactPersonId: bigint("contact_person_id", {
      mode: "number",
      unsigned: true,
    }),
    accountType: int("account_type").notNull(),
    accountId: int("account_id").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    isPrimary: tinyint("is_primary").default(0).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmEmailAddressListId: primaryKey({
        columns: [table.id],
        name: "crm_email_address_list_id",
      }),
    };
  },
);

export const crmHeirarchyDetails = mysqlTable(
  "crm_heirarchy_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    heirarchyId: bigint("heirarchy_id", { mode: "number" }).notNull(),
    taggedPositionId: int("tagged_position_id"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmHeirarchyDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_heirarchy_details_id",
      }),
    };
  },
);

export const crmHierarchy = mysqlTable(
  "crm_hierarchy",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmHierarchyId: primaryKey({
        columns: [table.id],
        name: "crm_hierarchy_id",
      }),
    };
  },
);

export const crmIndustry = mysqlTable(
  "crm_industry",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmIndustryId: primaryKey({
        columns: [table.id],
        name: "crm_industry_id",
      }),
    };
  },
);

export const crmKnowledge = mysqlTable(
  "crm_knowledge",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    faqConcern: varchar("faq_concern", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmKnowledgeId: primaryKey({
        columns: [table.id],
        name: "crm_knowledge_id",
      }),
    };
  },
);

export const crmKnowledgeResponse = mysqlTable(
  "crm_knowledge_response",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    knowledgeId: bigint("knowledge_id", { mode: "number" }).notNull(),
    responseArea: longtext("response_area"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmKnowledgeResponseId: primaryKey({
        columns: [table.id],
        name: "crm_knowledge_response_id",
      }),
    };
  },
);

export const crmLeadClassification = mysqlTable(
  "crm_lead_classification",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmLeadClassificationId: primaryKey({
        columns: [table.id],
        name: "crm_lead_classification_id",
      }),
    };
  },
);

export const crmLeadRetirementReasons = mysqlTable(
  "crm_lead_retirement_reasons",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmLeadRetirementReasonsId: primaryKey({
        columns: [table.id],
        name: "crm_lead_retirement_reasons_id",
      }),
    };
  },
);

export const crmLeadStatus = mysqlTable(
  "crm_lead_status",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmLeadStatusId: primaryKey({
        columns: [table.id],
        name: "crm_lead_status_id",
      }),
    };
  },
);

export const crmLeads = mysqlTable(
  "crm_leads",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    srNo: varchar("sr_no", { length: 255 }).notNull(),
    accountId: bigint("account_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    leadName: varchar("lead_name", { length: 255 }).notNull(),
    shipmentTypeId: bigint("shipment_type_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    serviceRequirementId: bigint("service_requirement_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    industryId: bigint("industry_id", { mode: "number", unsigned: true }),
    leadStatusId: bigint("lead_status_id", { mode: "number", unsigned: true }),
    retirementReasonId: int("retirement_reason_id"),
    retirementReasonRemarks: varchar("retirement_reason_remarks", {
      length: 255,
    }),
    qualificationScore: double("qualification_score"),
    leadClassificationId: bigint("lead_classification_id", {
      mode: "number",
      unsigned: true,
    }),
    description: longtext("description").notNull(),
    contactOwnerId: bigint("contact_owner_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    customerTypeId: bigint("customer_type_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    channelSourceId: bigint("channel_source_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    currency: int("currency").notNull(),
    dealSize: double("deal_size"),
    createdBy: bigint("created_by", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmLeadsId: primaryKey({ columns: [table.id], name: "crm_leads_id" }),
    };
  },
);

export const crmLifeStage = mysqlTable(
  "crm_life_stage",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmLifeStageId: primaryKey({
        columns: [table.id],
        name: "crm_life_stage_id",
      }),
    };
  },
);

export const crmMarketingChannel = mysqlTable(
  "crm_marketing_channel",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmMarketingChannelId: primaryKey({
        columns: [table.id],
        name: "crm_marketing_channel_id",
      }),
    };
  },
);

export const crmMilestoneResolution = mysqlTable(
  "crm_milestone_resolution",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    priorityLevel: int("priority_level").notNull(),
    severity: varchar("severity", { length: 255 }).notNull(),
    targetResponseTime: int("target_response_time").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmMilestoneResolutionId: primaryKey({
        columns: [table.id],
        name: "crm_milestone_resolution_id",
      }),
    };
  },
);

export const crmMilestoneResponse = mysqlTable(
  "crm_milestone_response",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    targetResponseTime: int("target_response_time").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmMilestoneResponseId: primaryKey({
        columns: [table.id],
        name: "crm_milestone_response_id",
      }),
    };
  },
);

export const crmMilestoneUrgencyImpact = mysqlTable(
  "crm_milestone_urgency_impact",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    severityId: bigint("severity_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmMilestoneResolution.id),
    highPriorityLevel: bigint("high_priority_level", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmMilestoneResolution.id),
    mediumPriorityLevel: bigint("medium_priority_level", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmMilestoneResolution.id),
    lowPriorityLevel: bigint("low_priority_level", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmMilestoneResolution.id),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmMilestoneUrgencyImpactId: primaryKey({
        columns: [table.id],
        name: "crm_milestone_urgency_impact_id",
      }),
    };
  },
);

export const crmMobileList = mysqlTable(
  "crm_mobile_list",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    contactPersonId: bigint("contact_person_id", {
      mode: "number",
      unsigned: true,
    }),
    accountType: int("account_type").notNull(),
    accountId: int("account_id").notNull(),
    mobile: varchar("mobile", { length: 255 }).notNull(),
    isPrimary: tinyint("is_primary").default(0).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmMobileListId: primaryKey({
        columns: [table.id],
        name: "crm_mobile_list_id",
      }),
    };
  },
);

export const crmModeOfPaymentReference = mysqlTable(
  "crm_mode_of_payment_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmModeOfPaymentReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_mode_of_payment_reference_id",
      }),
    };
  },
);

export const crmMovementSeaFreightTypeReference = mysqlTable(
  "crm_movement_sea_freight_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmMovementSeaFreightTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_movement_sea_freight_type_reference_id",
      }),
    };
  },
);

export const crmOnboardingChannelReference = mysqlTable(
  "crm_onboarding_channel_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmOnboardingChannelReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_onboarding_channel_reference_id",
      }),
    };
  },
);

export const crmOpportunity = mysqlTable(
  "crm_opportunity",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    srNo: varchar("sr_no", { length: 255 }).notNull(),
    accountId: bigint("account_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    opportunityName: varchar("opportunity_name", { length: 255 }).notNull(),
    industryId: bigint("industry_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmIndustry.id),
    salesStageId: bigint("sales_stage_id", { mode: "number", unsigned: true }),
    opportunityStatusId: bigint("opportunity_status_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmOpportunityStatusReference.id),
    contactOwnerId: int("contact_owner_id"),
    dealSize: bigint("deal_size", { mode: "number", unsigned: true }),
    actualAmount: double("actual_amount", {
      precision: 11,
      scale: 2,
    }).notNull(),
    bookingReference: varchar("booking_reference", { length: 255 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    leadConversionDate: date("lead_conversion_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    closeDate: date("close_date", { mode: "string" }),
    createdBy: bigint("created_by", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      salesStageIdForeign: index("crm_opportunity_sales_stage_id_foreign").on(
        table.salesStageId,
      ),
      crmOpportunityId: primaryKey({
        columns: [table.id],
        name: "crm_opportunity_id",
      }),
    };
  },
);

export const crmOpportunityAttachment = mysqlTable(
  "crm_opportunity_attachment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    opportunityId: bigint("opportunity_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      opportunityIdForeign: index(
        "crm_opportunity_attachment_opportunity_id_foreign",
      ).on(table.opportunityId),
      crmOpportunityAttachmentId: primaryKey({
        columns: [table.id],
        name: "crm_opportunity_attachment_id",
      }),
    };
  },
);

export const crmOpportunityStatusReference = mysqlTable(
  "crm_opportunity_status_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmOpportunityStatusReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_opportunity_status_reference_id",
      }),
    };
  },
);

export const crmQualificationQuestionManagement = mysqlTable(
  "crm_qualification_question_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    question: longtext("question").notNull(),
    qualificationType: bigint("qualification_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmQualificationQuestionManagementId: primaryKey({
        columns: [table.id],
        name: "crm_qualification_question_management_id",
      }),
    };
  },
);

export const crmQuotaAccountType = mysqlTable(
  "crm_quota_account_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmQuotaAccountTypeId: primaryKey({
        columns: [table.id],
        name: "crm_quota_account_type_id",
      }),
    };
  },
);

export const crmQuotaCsmDistributionType = mysqlTable(
  "crm_quota_csm_distribution_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    csmUserId: bigint("csm_user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    typeId: bigint("type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmQuotaAccountType.id),
    distributionPct: double("distribution_pct", {
      precision: 11,
      scale: 2,
    }).notNull(),
    quotaAmount: double("quota_amount", { precision: 11, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmQuotaCsmDistributionTypeId: primaryKey({
        columns: [table.id],
        name: "crm_quota_csm_distribution_type_id",
      }),
    };
  },
);

export const crmQuotaManagementCorporate = mysqlTable(
  "crm_quota_management_corporate",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    stakeholderCategoryName: varchar("stakeholder_category_name", {
      length: 255,
    }).notNull(),
    subcategory: bigint("subcategory", { mode: "number", unsigned: true }),
    managementId: bigint("management_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    accountType: int("account_type").notNull(),
    month: int("month").notNull(),
    year: int("year").notNull(),
    monthlyTonnage: double("monthly_tonnage", {
      precision: 11,
      scale: 2,
    }).notNull(),
    distributionPct: double("distribution_pct", {
      precision: 11,
      scale: 2,
    }).notNull(),
    monthlyCbmSea: double("monthly_cbm_sea", {
      precision: 11,
      scale: 3,
    }).notNull(),
    monthlyKgAir: double("monthly_kg_air", {
      precision: 11,
      scale: 2,
    }).notNull(),
    monthlyCbmLand: double("monthly_cbm_land", {
      precision: 11,
      scale: 3,
    }).notNull(),
    monthlyKgInt: double("monthly_kg_int", {
      precision: 11,
      scale: 2,
    }).notNull(),
    totalDaysCount: double("total_days_count", {
      precision: 11,
      scale: 2,
    }).notNull(),
    monthlyTargetAmount: double("monthly_target_amount", {
      precision: 11,
      scale: 2,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmQuotaManagementCorporateId: primaryKey({
        columns: [table.id],
        name: "crm_quota_management_corporate_id",
      }),
    };
  },
);

export const crmQuotaManagementStakeholder = mysqlTable(
  "crm_quota_management_stakeholder",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    stakeholderCategoryName: varchar("stakeholder_category_name", {
      length: 255,
    }).notNull(),
    subcategory: bigint("subcategory", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    managementId: bigint("management_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    accountType: int("account_type").notNull(),
    month: int("month").notNull(),
    year: int("year").notNull(),
    distributionPct: double("distribution_pct", {
      precision: 11,
      scale: 2,
    }).notNull(),
    amount: double("amount", { precision: 11, scale: 2 }).notNull(),
    actualVolume: double("actual_volume", { precision: 11, scale: 2 }),
    actualAmount: double("actual_amount", { precision: 11, scale: 2 }),
    totalDaysCount: double("total_days_count", { precision: 11, scale: 2 }),
    monthlyTargetAmount: double("monthly_target_amount", {
      precision: 11,
      scale: 2,
    }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmQuotaManagementStakeholderId: primaryKey({
        columns: [table.id],
        name: "crm_quota_management_stakeholder_id",
      }),
    };
  },
);

export const crmQuotation = mysqlTable(
  "crm_quotation",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    referenceNo: varchar("reference_no", { length: 255 }),
    accountId: bigint("account_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    srNo: varchar("sr_no", { length: 255 }).notNull(),
    subject: longtext("subject").notNull(),
    shipmentTypeId: bigint("shipment_type_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmShipmentType.id),
    assignedTo: int("assigned_to").notNull(),
    isSave: tinyint("is_save").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmQuotationId: primaryKey({
        columns: [table.id],
        name: "crm_quotation_id",
      }),
    };
  },
);

export const crmRateAirfreight = mysqlTable(
  "crm_rate_airfreight",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    effectivityDate: date("effectivity_date", { mode: "string" }).notNull(),
    description: longtext("description"),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateTransportModeReference.id),
    commodityTypeId: bigint("commodity_type_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmCommodityTypeReference.id),
    applyForId: bigint("apply_for_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmRateApplyForReference.id),
    ancillaryChargeId: bigint("ancillary_charge_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmAncillaryDisplayManagement.id),
    serviceModeId: bigint("service_mode_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmServiceModeReference.id),
    isViceVersa: tinyint("is_vice_versa"),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver1StatusId: bigint("approver1_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    approver2StatusId: bigint("approver2_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver1Date: date("approver1_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    appover2Date: date("appover2_date", { mode: "string" }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmApprovalReference.id),
    baseRateId: bigint("base_rate_id", { mode: "number", unsigned: true }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateAirfreightId: primaryKey({
        columns: [table.id],
        name: "crm_rate_airfreight_id",
      }),
    };
  },
);

export const crmRateAirfreightDetails = mysqlTable(
  "crm_rate_airfreight_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rateId: bigint("rate_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRateAirfreight.id),
    originId: bigint("origin_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    destinationId: bigint("destination_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    amountWeight1: double("amount_weight_1", { precision: 8, scale: 2 }),
    amountWeight2: double("amount_weight_2", { precision: 8, scale: 2 }),
    amountWeight3: double("amount_weight_3", { precision: 8, scale: 2 }),
    amountWeight4: double("amount_weight_4", { precision: 8, scale: 2 }),
    amountWeight5: double("amount_weight_5", { precision: 8, scale: 2 }),
    isPrimary: bigint("is_primary", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateAirfreightDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_rate_airfreight_details_id",
      }),
    };
  },
);

export const crmRateAirfreightPremium = mysqlTable(
  "crm_rate_airfreight_premium",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    effectivityDate: date("effectivity_date", { mode: "string" }).notNull(),
    description: longtext("description"),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateTransportModeReference.id),
    commodityTypeId: bigint("commodity_type_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmCommodityTypeReference.id),
    applyForId: bigint("apply_for_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmRateApplyForReference.id),
    ancillaryChargeId: bigint("ancillary_charge_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmAncillaryDisplayManagement.id),
    isViceVersa: tinyint("is_vice_versa"),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver1StatusId: bigint("approver1_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    approver2StatusId: bigint("approver2_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver1Date: date("approver1_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    appover2Date: date("appover2_date", { mode: "string" }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmApprovalReference.id),
    baseRateId: bigint("base_rate_id", { mode: "number", unsigned: true }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateAirfreightPremiumId: primaryKey({
        columns: [table.id],
        name: "crm_rate_airfreight_premium_id",
      }),
    };
  },
);

export const crmRateAirfreightPremiumDetails = mysqlTable(
  "crm_rate_airfreight_premium_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rateId: bigint("rate_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRateAirfreightPremium.id),
    originId: bigint("origin_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    destinationId: bigint("destination_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    amountWeight1: double("amount_weight_1", { precision: 8, scale: 2 }),
    amountWeight2: double("amount_weight_2", { precision: 8, scale: 2 }),
    amountWeight3: double("amount_weight_3", { precision: 8, scale: 2 }),
    amountWeight4: double("amount_weight_4", { precision: 8, scale: 2 }),
    serviceModeId: bigint("service_mode_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmServiceModeReference.id),
    isPrimary: bigint("is_primary", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateAirfreightPremiumDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_rate_airfreight_premium_details_id",
      }),
    };
  },
);

export const crmRateApplyForReference = mysqlTable(
  "crm_rate_apply_for_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateApplyForReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_rate_apply_for_reference_id",
      }),
    };
  },
);

export const crmRateBox = mysqlTable(
  "crm_rate_box",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    effectivityDate: date("effectivity_date", { mode: "string" }).notNull(),
    description: longtext("description"),
    rateTypeId: bigint("rate_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRateTypeReference.id),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateTransportModeReference.id),
    bookingTypeId: bigint("booking_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBookingTypeReference.id),
    applyForId: bigint("apply_for_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmRateApplyForReference.id),
    isViceVersa: tinyint("is_vice_versa"),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver1StatusId: bigint("approver1_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    approver2StatusId: bigint("approver2_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver1Date: date("approver1_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    appover2Date: date("appover2_date", { mode: "string" }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmApprovalReference.id),
    baseRateId: bigint("base_rate_id", { mode: "number", unsigned: true }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateBoxId: primaryKey({
        columns: [table.id],
        name: "crm_rate_box_id",
      }),
    };
  },
);

export const crmRateBoxDetails = mysqlTable(
  "crm_rate_box_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rateId: bigint("rate_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRateBox.id),
    originId: bigint("origin_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    destinationId: bigint("destination_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    amountSmall: double("amount_small", { precision: 8, scale: 2 }),
    amountMedium: double("amount_medium", { precision: 8, scale: 2 }),
    amountLarge: double("amount_large", { precision: 8, scale: 2 }),
    isPrimary: bigint("is_primary", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateBoxDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_rate_box_details_id",
      }),
    };
  },
);

export const crmRateCrating = mysqlTable(
  "crm_rate_crating",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    effectivityDate: date("effectivity_date", { mode: "string" }).notNull(),
    description: longtext("description"),
    cratingTypeId: bigint("crating_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmCratingTypeReference.id),
    applyForId: bigint("apply_for_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmRateApplyForReference.id),
    amountPerCbm: double("amount_per_cbm", { precision: 8, scale: 2 }),
    ancillaryCharge: double("ancillary_charge", { precision: 8, scale: 2 }),
    isViceVersa: tinyint("is_vice_versa"),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver1StatusId: bigint("approver1_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    approver2StatusId: bigint("approver2_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver1Date: date("approver1_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    appover2Date: date("appover2_date", { mode: "string" }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmApprovalReference.id),
    baseRateId: bigint("base_rate_id", { mode: "number", unsigned: true }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateCratingId: primaryKey({
        columns: [table.id],
        name: "crm_rate_crating_id",
      }),
    };
  },
);

export const crmRateLandfreight = mysqlTable(
  "crm_rate_landfreight",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    effectivityDate: date("effectivity_date", { mode: "string" }).notNull(),
    description: longtext("description"),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateTransportModeReference.id),
    commodityTypeId: bigint("commodity_type_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmCommodityTypeReference.id),
    applyForId: bigint("apply_for_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmRateApplyForReference.id),
    ancillaryChargeId: bigint("ancillary_charge_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmAncillaryDisplayManagement.id),
    serviceModeId: bigint("service_mode_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmServiceModeReference.id),
    isViceVersa: tinyint("is_vice_versa"),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver1StatusId: bigint("approver1_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    approver2StatusId: bigint("approver2_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver1Date: date("approver1_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    appover2Date: date("appover2_date", { mode: "string" }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmApprovalReference.id),
    baseRateId: bigint("base_rate_id", { mode: "number", unsigned: true }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateLandfreightId: primaryKey({
        columns: [table.id],
        name: "crm_rate_landfreight_id",
      }),
    };
  },
);

export const crmRateLandfreightDetails = mysqlTable(
  "crm_rate_landfreight_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rateId: bigint("rate_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRateLandfreight.id),
    originId: bigint("origin_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    destinationId: bigint("destination_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    amountWeight1: double("amount_weight_1", { precision: 8, scale: 2 }),
    amountWeight2: double("amount_weight_2", { precision: 8, scale: 2 }),
    amountWeight3: double("amount_weight_3", { precision: 8, scale: 2 }),
    amountWeight4: double("amount_weight_4", { precision: 8, scale: 2 }),
    isPrimary: bigint("is_primary", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateLandfreightDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_rate_landfreight_details_id",
      }),
    };
  },
);

export const crmRateLoaManagement = mysqlTable(
  "crm_rate_loa_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rateCategory: bigint("rate_category", { mode: "number" }).notNull(),
    approver1Id: bigint("approver1_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    approver2Id: bigint("approver2_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateLoaManagementId: primaryKey({
        columns: [table.id],
        name: "crm_rate_loa_management_id",
      }),
    };
  },
);

export const crmRatePouch = mysqlTable(
  "crm_rate_pouch",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    effectivityDate: date("effectivity_date", { mode: "string" }).notNull(),
    description: longtext("description"),
    rateTypeId: bigint("rate_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRateTypeReference.id),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateTransportModeReference.id),
    bookingTypeId: bigint("booking_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmBookingTypeReference.id),
    applyForId: bigint("apply_for_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmRateApplyForReference.id),
    pouchTypeId: bigint("pouch_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRatePouchType.id),
    isViceVersa: tinyint("is_vice_versa"),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver1StatusId: bigint("approver1_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    approver2StatusId: bigint("approver2_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver1Date: date("approver1_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    appover2Date: date("appover2_date", { mode: "string" }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmApprovalReference.id),
    baseRateId: bigint("base_rate_id", { mode: "number", unsigned: true }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRatePouchId: primaryKey({
        columns: [table.id],
        name: "crm_rate_pouch_id",
      }),
    };
  },
);

export const crmRatePouchDetails = mysqlTable(
  "crm_rate_pouch_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    pouchId: bigint("pouch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRatePouch.id),
    originId: bigint("origin_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    destinationId: bigint("destination_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    amountSmall: double("amount_small", { precision: 8, scale: 2 }),
    amountMedium: double("amount_medium", { precision: 8, scale: 2 }),
    amountLarge: double("amount_large", { precision: 8, scale: 2 }),
    isPrimary: bigint("is_primary", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRatePouchDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_rate_pouch_details_id",
      }),
    };
  },
);

export const crmRatePouchType = mysqlTable(
  "crm_rate_pouch_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRatePouchTypeId: primaryKey({
        columns: [table.id],
        name: "crm_rate_pouch_type_id",
      }),
    };
  },
);

export const crmRateSeafreight = mysqlTable(
  "crm_rate_seafreight",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    effectivityDate: date("effectivity_date", { mode: "string" }).notNull(),
    description: longtext("description"),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateTransportModeReference.id),
    shipmentTypeId: bigint("shipment_type_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmShipmentType.id),
    commodityTypeId: bigint("commodity_type_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmCommodityTypeReference.id),
    applyForId: bigint("apply_for_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmRateApplyForReference.id),
    ancillaryChargeId: bigint("ancillary_charge_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmAncillaryDisplayManagement.id),
    serviceModeId: bigint("service_mode_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmServiceModeReference.id),
    isViceVersa: tinyint("is_vice_versa"),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver1StatusId: bigint("approver1_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    approver2StatusId: bigint("approver2_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver1Date: date("approver1_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    appover2Date: date("appover2_date", { mode: "string" }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmApprovalReference.id),
    baseRateId: bigint("base_rate_id", { mode: "number", unsigned: true }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateSeafreightId: primaryKey({
        columns: [table.id],
        name: "crm_rate_seafreight_id",
      }),
    };
  },
);

export const crmRateSeafreightDetails = mysqlTable(
  "crm_rate_seafreight_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rateId: bigint("rate_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRateSeafreight.id),
    originId: bigint("origin_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    destinationId: bigint("destination_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    amountWeight1: double("amount_weight_1", { precision: 8, scale: 2 }),
    amountWeight2: double("amount_weight_2", { precision: 8, scale: 2 }),
    amountWeight3: double("amount_weight_3", { precision: 8, scale: 2 }),
    amountWeight4: double("amount_weight_4", { precision: 8, scale: 2 }),
    amountServicemode1: double("amount_servicemode_1", {
      precision: 8,
      scale: 2,
    }),
    amountServicemode2: double("amount_servicemode_2", {
      precision: 8,
      scale: 2,
    }),
    amountServicemode3: double("amount_servicemode_3", {
      precision: 8,
      scale: 2,
    }),
    amountServicemode4: double("amount_servicemode_4", {
      precision: 8,
      scale: 2,
    }),
    size: bigint("size", { mode: "number", unsigned: true }),
    isPrimary: bigint("is_primary", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateSeafreightDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_rate_seafreight_details_id",
      }),
    };
  },
);

export const crmRateTransportModeReference = mysqlTable(
  "crm_rate_transport_mode_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateTransportModeReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_rate_transport_mode_reference_id",
      }),
    };
  },
);

export const crmRateTypeReference = mysqlTable(
  "crm_rate_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_rate_type_reference_id",
      }),
    };
  },
);

export const crmRateWarehousing = mysqlTable(
  "crm_rate_warehousing",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    effectivityDate: date("effectivity_date", { mode: "string" }).notNull(),
    description: longtext("description"),
    applyForId: bigint("apply_for_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmRateApplyForReference.id),
    approver1Id: bigint("approver1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    approver2Id: bigint("approver2_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    ancillaryChargeId: bigint("ancillary_charge_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmAncillaryDisplayManagement.id),
    approver1StatusId: bigint("approver1_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    approver2StatusId: bigint("approver2_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmApprovalReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approver1Date: date("approver1_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    appover2Date: date("appover2_date", { mode: "string" }),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmApprovalReference.id),
    baseRateId: bigint("base_rate_id", { mode: "number", unsigned: true }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateWarehousingId: primaryKey({
        columns: [table.id],
        name: "crm_rate_warehousing_id",
      }),
    };
  },
);

export const crmRateWarehousingDetails = mysqlTable(
  "crm_rate_warehousing_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rateId: bigint("rate_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmRateWarehousing.id),
    warehousingOptionId: bigint("warehousing_option_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmRateWarehousingOptionReference.id),
    amountShortTerm: double("amount_short_term", { precision: 8, scale: 2 }),
    amountLongTerm: double("amount_long_term", { precision: 8, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateWarehousingDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_rate_warehousing_details_id",
      }),
    };
  },
);

export const crmRateWarehousingOptionReference = mysqlTable(
  "crm_rate_warehousing_option_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    option: varchar("option", { length: 255 }).notNull(),
    ratePerUnit: varchar("rate_per_unit", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmRateWarehousingOptionReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_rate_warehousing_option_reference_id",
      }),
    };
  },
);

export const crmSalesCampaign = mysqlTable(
  "crm_sales_campaign",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    referenceNo: varchar("reference_no", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    voucherCode: varchar("voucher_code", { length: 255 }).notNull(),
    discountType: int("discount_type").notNull(),
    discountAmount: double("discount_amount"),
    discountPercentage: double("discount_percentage"),
    startDatetime: datetime("start_datetime", { mode: "string" }).notNull(),
    endDatetime: datetime("end_datetime", { mode: "string" }).notNull(),
    maximumUsage: int("maximum_usage").notNull(),
    termsConditon: longtext("terms_conditon").notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSalesCampaignId: primaryKey({
        columns: [table.id],
        name: "crm_sales_campaign_id",
      }),
    };
  },
);

export const crmSalesCampaignAttachment = mysqlTable(
  "crm_sales_campaign_attachment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    salesCampaignId: bigint("sales_campaign_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => crmSalesCampaign.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSalesCampaignAttachmentId: primaryKey({
        columns: [table.id],
        name: "crm_sales_campaign_attachment_id",
      }),
    };
  },
);

export const crmSalesCoach = mysqlTable(
  "crm_sales_coach",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: longtext("description"),
    status: int("status").notNull(),
    createdBy: bigint("created_by", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSalesCoachId: primaryKey({
        columns: [table.id],
        name: "crm_sales_coach_id",
      }),
    };
  },
);

export const crmSalesCoachProcess = mysqlTable(
  "crm_sales_coach_process",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    processContent: varchar("process_content", { length: 255 }).notNull(),
    salesCoachId: bigint("sales_coach_id", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSalesCoachProcessId: primaryKey({
        columns: [table.id],
        name: "crm_sales_coach_process_id",
      }),
    };
  },
);

export const crmSalesCoachSubprocess = mysqlTable(
  "crm_sales_coach_subprocess",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    processContent: varchar("process_content", { length: 255 }).notNull(),
    salesCoachProcessId: bigint("sales_coach_process_id", {
      mode: "number",
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSalesCoachSubprocessId: primaryKey({
        columns: [table.id],
        name: "crm_sales_coach_subprocess_id",
      }),
    };
  },
);

export const crmSalesStage = mysqlTable(
  "crm_sales_stage",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    salesStage: varchar("sales_stage", { length: 255 }).notNull(),
    opportunityStatusId: bigint("opportunity_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmOpportunityStatusReference.id),
    status: int("status", { unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSalesStageId: primaryKey({
        columns: [table.id],
        name: "crm_sales_stage_id",
      }),
    };
  },
);

export const crmScheduleAMeeting = mysqlTable(
  "crm_schedule_a_meeting",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    start: varchar("start", { length: 255 }).notNull(),
    end: varchar("end", { length: 255 }).notNull(),
    status: int("status"),
    isAllDay: int("is_all_day"),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    eventId: varchar("event_id", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmScheduleAMeetingId: primaryKey({
        columns: [table.id],
        name: "crm_schedule_a_meeting_id",
      }),
    };
  },
);

export const crmServiceModeReference = mysqlTable(
  "crm_service_mode_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: bigint("type", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmServiceModeReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_service_mode_reference_id",
      }),
    };
  },
);

export const crmServiceRequest = mysqlTable(
  "crm_service_request",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    srNo: varchar("sr_no", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    customer: int("customer"),
    accountId: int("account_id"),
    serviceRequestTypeId: bigint("service_request_type_id", {
      mode: "number",
      unsigned: true,
    }),
    severityId: bigint("severity_id", { mode: "number", unsigned: true }),
    subCategoryId: bigint("sub_category_id", {
      mode: "number",
      unsigned: true,
    }),
    subCategoryReference: varchar("sub_category_reference", { length: 255 }),
    serviceRequirementId: bigint("service_requirement_id", {
      mode: "number",
      unsigned: true,
    }),
    assignedToId: bigint("assigned_to_id", { mode: "number", unsigned: true }),
    channelId: bigint("channel_id", { mode: "number", unsigned: true }),
    statusId: bigint("status_id", { mode: "number", unsigned: true }),
    lifeStageId: bigint("life_stage_id", { mode: "number", unsigned: true }),
    description: longtext("description"),
    createdBy: bigint("created_by", { mode: "number", unsigned: true }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    updatedBy: bigint("updated_by", { mode: "number", unsigned: true }),
    resolvedDate: datetime("resolved_date", { mode: "string" }),
  },
  (table) => {
    return {
      crmServiceRequestId: primaryKey({
        columns: [table.id],
        name: "crm_service_request_id",
      }),
    };
  },
);

export const crmServiceRequirements = mysqlTable(
  "crm_service_requirements",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmServiceRequirementsId: primaryKey({
        columns: [table.id],
        name: "crm_service_requirements_id",
      }),
    };
  },
);

export const crmShipmentCharges = mysqlTable(
  "crm_shipment_charges",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    quotationId: bigint("quotation_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmQuotation.id),
    weightCharge: double("weight_charge", { precision: 11, scale: 2 }),
    awbFee: double("awb_fee", { precision: 11, scale: 2 }),
    valuation: double("valuation", { precision: 11, scale: 2 }),
    codCharge: double("cod_charge", { precision: 11, scale: 2 }),
    insurance: double("insurance", { precision: 11, scale: 2 }),
    handlingFee: double("handling_fee", { precision: 11, scale: 2 }),
    docFee: double("doc_fee", { precision: 11, scale: 2 }),
    isOtherFee: tinyint("is_other_fee"),
    totalOtherFee: double("total_other_fee", { precision: 11, scale: 2 }),
    odaFee: double("oda_fee", { precision: 11, scale: 2 }),
    opaFee: double("opa_fee", { precision: 11, scale: 2 }),
    equipmentRental: double("equipment_rental", { precision: 11, scale: 2 }),
    cratingFee: double("crating_fee", { precision: 11, scale: 2 }),
    lashing: double("lashing", { precision: 11, scale: 2 }),
    manpower: double("manpower", { precision: 11, scale: 2 }),
    dangerousGoodsFee: double("dangerous_goods_fee", {
      precision: 11,
      scale: 2,
    }),
    trucking: double("trucking", { precision: 11, scale: 2 }),
    perishableFee: double("perishable_fee", { precision: 11, scale: 2 }),
    packagingFee: double("packaging_fee", { precision: 11, scale: 2 }),
    discountAmount: double("discount_amount", { precision: 11, scale: 2 }),
    discountPercentage: double("discount_percentage", {
      precision: 11,
      scale: 2,
    }),
    subtotal: double("subtotal", { precision: 11, scale: 2 }),
    evat: double("evat", { precision: 11, scale: 2 }),
    isEvat: tinyint("is_evat"),
    grandtotal: double("grandtotal", { precision: 11, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmShipmentChargesId: primaryKey({
        columns: [table.id],
        name: "crm_shipment_charges_id",
      }),
    };
  },
);

export const crmShipmentDetails = mysqlTable(
  "crm_shipment_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    quotationId: bigint("quotation_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmQuotation.id),
    originId: bigint("origin_id", { mode: "number", unsigned: true }),
    destinationId: bigint("destination_id", { mode: "number", unsigned: true }),
    originAddress: longtext("origin_address"),
    destinationAddress: longtext("destination_address"),
    declaredValue: double("declared_value", { precision: 11, scale: 2 }),
    transhipmentId: bigint("transhipment_id", {
      mode: "number",
      unsigned: true,
    }),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
      unsigned: true,
    }),
    commodityTypeId: bigint("commodity_type_id", {
      mode: "number",
      unsigned: true,
    }),
    commodityApplicableRateId: bigint("commodity_applicable_rate_id", {
      mode: "number",
      unsigned: true,
    }),
    paymodeId: bigint("paymode_id", { mode: "number", unsigned: true }),
    servicemodeId: bigint("servicemode_id", { mode: "number", unsigned: true }),
    serviceTypeId: bigint("service_type_id", {
      mode: "number",
      unsigned: true,
    }),
    seaShipmentType: int("sea_shipment_type"),
    totalCbm: double("total_cbm", { precision: 11, scale: 2 }),
    totalChgwt: double("total_chgwt", { precision: 11, scale: 2 }),
    totalAmount: double("total_amount", { precision: 11, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmShipmentDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_shipment_details_id",
      }),
    };
  },
);

export const crmShipmentDimensions = mysqlTable(
  "crm_shipment_dimensions",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    quotationId: bigint("quotation_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmQuotation.id),
    quantity: double("quantity", { precision: 11, scale: 2 }),
    weight: double("weight", { precision: 11, scale: 2 }),
    length: double("length", { precision: 11, scale: 2 }),
    width: double("width", { precision: 11, scale: 2 }),
    height: double("height", { precision: 11, scale: 2 }),
    unitOfMeasurementId: bigint("unit_of_measurement_id", {
      mode: "number",
      unsigned: true,
    }),
    measurementTypeId: bigint("measurement_type_id", {
      mode: "number",
      unsigned: true,
    }),
    typeOfPackagingId: bigint("type_of_packaging_id", {
      mode: "number",
      unsigned: true,
    }),
    isForCrating: tinyint("is_for_crating"),
    cratingTypeId: bigint("crating_type_id", {
      mode: "number",
      unsigned: true,
    }),
    pouchBoxSize: int("pouch_box_size"),
    pouchBoxAmount: double("pouch_box_amount", { precision: 11, scale: 2 }),
    container: int("container"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmShipmentDimensionsId: primaryKey({
        columns: [table.id],
        name: "crm_shipment_dimensions_id",
      }),
    };
  },
);

export const crmShipmentType = mysqlTable(
  "crm_shipment_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: bigint("type", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmShipmentTypeId: primaryKey({
        columns: [table.id],
        name: "crm_shipment_type_id",
      }),
    };
  },
);

export const crmSrAttachments = mysqlTable(
  "crm_sr_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    srId: bigint("sr_id", { mode: "number", unsigned: true }).notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    originalFileName: varchar("original_file_name", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSrAttachmentsId: primaryKey({
        columns: [table.id],
        name: "crm_sr_attachments_id",
      }),
    };
  },
);

export const crmSrEmailDetails = mysqlTable(
  "crm_sr_email_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    srNo: varchar("sr_no", { length: 255 }).notNull(),
    emailExternal: varchar("email_external", { length: 255 }).notNull(),
    emailInternal: varchar("email_internal", { length: 255 }).notNull(),
    subject: longtext("subject").notNull(),
    body: longtext("body"),
    messageId: longtext("message_id"),
    emailUid: varchar("email_uid", { length: 255 }),
    references: longtext("references"),
    status: int("status").notNull(),
    type: int("type").notNull(),
    isFirstEmail: tinyint("is_first_email"),
    isRead: tinyint("is_read").default(0).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSrEmailDetailsId: primaryKey({
        columns: [table.id],
        name: "crm_sr_email_details_id",
      }),
    };
  },
);

export const crmSrQualificationQuestion = mysqlTable(
  "crm_sr_qualification_question",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    leadId: bigint("lead_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmLeads.id),
    srNo: varchar("sr_no", { length: 255 }).notNull(),
    questionId: bigint("question_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmQualificationQuestionManagement.id),
    response: varchar("response", { length: 255 }),
    remarks: longtext("remarks"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSrQualificationQuestionId: primaryKey({
        columns: [table.id],
        name: "crm_sr_qualification_question_id",
      }),
    };
  },
);

export const crmSrStatusReferences = mysqlTable(
  "crm_sr_status_references",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSrStatusReferencesId: primaryKey({
        columns: [table.id],
        name: "crm_sr_status_references_id",
      }),
    };
  },
);

export const crmSrType = mysqlTable(
  "crm_sr_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSrTypeId: primaryKey({ columns: [table.id], name: "crm_sr_type_id" }),
    };
  },
);

export const crmSrTypeSubcategory = mysqlTable(
  "crm_sr_type_subcategory",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    srTypeId: bigint("sr_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmSrType.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmSrTypeSubcategoryId: primaryKey({
        columns: [table.id],
        name: "crm_sr_type_subcategory_id",
      }),
    };
  },
);

export const crmStakeholderCategoryManagement = mysqlTable(
  "crm_stakeholder_category_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    stakeholderCategoryName: varchar("stakeholder_category_name", {
      length: 255,
    }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    subcategory: bigint("subcategory", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    managementId: bigint("management_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    accountType: int("account_type").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmStakeholderCategoryManagementId: primaryKey({
        columns: [table.id],
        name: "crm_stakeholder_category_management_id",
      }),
    };
  },
);

export const crmStakeholderSearchManagementReference = mysqlTable(
  "crm_stakeholder_search_management_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    tableName: varchar("table_name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmStakeholderSearchManagementReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_stakeholder_search_management_reference_id",
      }),
    };
  },
);

export const crmTelephoneList = mysqlTable(
  "crm_telephone_list",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    contactPersonId: bigint("contact_person_id", {
      mode: "number",
      unsigned: true,
    }),
    accountType: int("account_type").notNull(),
    accountId: int("account_id").notNull(),
    telephone: varchar("telephone", { length: 255 }),
    isPrimary: tinyint("is_primary").default(0).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmTelephoneListId: primaryKey({
        columns: [table.id],
        name: "crm_telephone_list_id",
      }),
    };
  },
);

export const crmTimeslot = mysqlTable(
  "crm_timeslot",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmTimeslotId: primaryKey({
        columns: [table.id],
        name: "crm_timeslot_id",
      }),
    };
  },
);

export const crmVehicleTypeReference = mysqlTable(
  "crm_vehicle_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      crmVehicleTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "crm_vehicle_type_reference_id",
      }),
    };
  },
);

export const division = mysqlTable(
  "division",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    portalName: varchar("portal_name", { length: 255 }),
    description: varchar("description", { length: 255 }),
    teamsStatus: tinyint("teams_status").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      divisionId: primaryKey({ columns: [table.id], name: "division_id" }),
    };
  },
);

export const divisionRolesAccess = mysqlTable(
  "division_roles_access",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    roleId: bigint("role_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => divisionRolesReference.id),
    accessId: bigint("access_id", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountTypeRolesAccessAccessIdForeign: index(
        "account_type_roles_access_access_id_foreign",
      ).on(table.accessId),
      accountTypeRolesAccessRoleIdForeign: index(
        "account_type_roles_access_role_id_foreign",
      ).on(table.roleId),
      divisionRolesAccessId: primaryKey({
        columns: [table.id],
        name: "division_roles_access_id",
      }),
    };
  },
);

export const divisionRolesReference = mysqlTable(
  "division_roles_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    divisionId: bigint("division_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    levelId: bigint("level_id", { mode: "number", unsigned: true }).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: bigint("is_visible", { mode: "number", unsigned: true })
      .default(1)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      accountTypeRolesReferenceDivisionIdForeign: index(
        "account_type_roles_reference_division_id_foreign",
      ).on(table.divisionId),
      accountTypeRolesReferenceLevelIdForeign: index(
        "account_type_roles_reference_level_id_foreign",
      ).on(table.levelId),
      divisionRolesReferenceId: primaryKey({
        columns: [table.id],
        name: "division_roles_reference_id",
      }),
    };
  },
);

export const failedJobs = mysqlTable(
  "failed_jobs",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    uuid: varchar("uuid", { length: 255 }).notNull(),
    connection: text("connection").notNull(),
    queue: text("queue").notNull(),
    payload: longtext("payload").notNull(),
    exception: longtext("exception").notNull(),
    failedAt: timestamp("failed_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      failedJobsId: primaryKey({ columns: [table.id], name: "failed_jobs_id" }),
      failedJobsUuidUnique: unique("failed_jobs_uuid_unique").on(table.uuid),
    };
  },
);

export const hrim201Files = mysqlTable(
  "hrim_201_files",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    hrim201ReferenceId: bigint("hrim_201_reference_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrim201FilesReference.id),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrim201FilesId: primaryKey({
        columns: [table.id],
        name: "hrim_201_files_id",
      }),
    };
  },
);

export const hrim201FilesAttachments = mysqlTable(
  "hrim_201_files_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    hrim201FilesId: bigint("hrim_201_files_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrim201Files.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrim201FilesAttachmentsId: primaryKey({
        columns: [table.id],
        name: "hrim_201_files_attachments_id",
      }),
    };
  },
);

export const hrim201FilesReference = mysqlTable(
  "hrim_201_files_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrim201FilesReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_201_files_reference_id",
      }),
    };
  },
);

export const hrimAbsent = mysqlTable(
  "hrim_absent",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    absentDate: date("absent_date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimAbsentId: primaryKey({ columns: [table.id], name: "hrim_absent_id" }),
    };
  },
);

export const hrimAdminAdjCategoryReference = mysqlTable(
  "hrim_admin_adj_category_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimAdminAdjCategoryReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_admin_adj_category_reference_id",
      }),
    };
  },
);

export const hrimAdminAdjustment = mysqlTable(
  "hrim_admin_adjustment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    category: int("category").notNull(),
    description: longtext("description"),
    year: int("year"),
    month: int("month"),
    payoutCutoff: int("payout_cutoff"),
    amount: decimal("amount", { precision: 8, scale: 2 }),
    firstApprover: bigint("first_approver", { mode: "number", unsigned: true }),
    secondApprover: bigint("second_approver", {
      mode: "number",
      unsigned: true,
    }),
    firstStatus: int("first_status"),
    secondStatus: int("second_status"),
    firstRemarks: longtext("first_remarks"),
    secondRemarks: longtext("second_remarks"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    firstDate: date("first_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    secondDate: date("second_date", { mode: "string" }),
    finalStatus: int("final_status"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimAdminAdjustmentId: primaryKey({
        columns: [table.id],
        name: "hrim_admin_adjustment_id",
      }),
    };
  },
);

export const hrimAgencies = mysqlTable(
  "hrim_agencies",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: longtext("description"),
    branchId: bigint("branch_id", {
      mode: "number",
      unsigned: true,
    }).references(() => branchReference.id),
    isActive: tinyint("is_active").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimAgenciesId: primaryKey({
        columns: [table.id],
        name: "hrim_agencies_id",
      }),
    };
  },
);

export const hrimAnnouncementAttachments = mysqlTable(
  "hrim_announcement_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    announcementId: bigint("announcement_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimAnnouncements.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimAnnouncementAttachmentsId: primaryKey({
        columns: [table.id],
        name: "hrim_announcement_attachments_id",
      }),
    };
  },
);

export const hrimAnnouncements = mysqlTable(
  "hrim_announcements",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    announcementNo: varchar("announcement_no", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    datePosted: date("date_posted", { mode: "string" }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    details: longtext("details").notNull(),
    postedBy: bigint("posted_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimAnnouncementsId: primaryKey({
        columns: [table.id],
        name: "hrim_announcements_id",
      }),
    };
  },
);

export const hrimApplicantTracking = mysqlTable(
  "hrim_applicant_tracking",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    erfReferenceNoId: bigint("erf_reference_no_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimEmployeeRequisition.id),
    firstname: varchar("firstname", { length: 255 }).notNull(),
    middlename: varchar("middlename", { length: 255 }),
    lastname: varchar("lastname", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateApplied: date("date_applied", { mode: "string" }).notNull(),
    hrNotes: longtext("hr_notes"),
    hiringManagerNotes: longtext("hiring_manager_notes"),
    gmNotes: longtext("gm_notes"),
    statusId: bigint("status_id", { mode: "number", unsigned: true }).notNull(),
    divisionId: bigint("division_id", { mode: "number", unsigned: true }),
    remarks: longtext("remarks"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    secondApprovalDate: date("2nd_approval_date", { mode: "string" }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimApplicantTrackingId: primaryKey({
        columns: [table.id],
        name: "hrim_applicant_tracking_id",
      }),
    };
  },
);

export const hrimApplicantTrackingAttachments = mysqlTable(
  "hrim_applicant_tracking_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    applicantTrackId: bigint("applicant_track_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimApplicantTracking.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimApplicantTrackingAttachmentsId: primaryKey({
        columns: [table.id],
        name: "hrim_applicant_tracking_attachments_id",
      }),
    };
  },
);

export const hrimApplicantTrackingLog = mysqlTable(
  "hrim_applicant_tracking_log",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    erfReferenceNoId: bigint("erf_reference_no_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    date: date("date", { mode: "string" }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    remarks: longtext("remarks"),
    type: tinyint("type").notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimApplicantTrackingLogId: primaryKey({
        columns: [table.id],
        name: "hrim_applicant_tracking_log_id",
      }),
    };
  },
);

export const hrimApplicantTrackingStatus = mysqlTable(
  "hrim_applicant_tracking_status",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimApplicantTrackingStatusId: primaryKey({
        columns: [table.id],
        name: "hrim_applicant_tracking_status_id",
      }),
    };
  },
);

export const hrimBenefits = mysqlTable(
  "hrim_benefits",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    benefitType: varchar("benefit_type", { length: 255 }).notNull(),
    description: longtext("description").notNull(),
    createdBy: bigint("created_by", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimBenefitsId: primaryKey({
        columns: [table.id],
        name: "hrim_benefits_id",
      }),
    };
  },
);

export const hrimCalendar = mysqlTable(
  "hrim_calendar",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    branchId: bigint("branch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    eventTypeId: bigint("event_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimEventTypeReference.id),
    eventDateTime: datetime("event_date_time", { mode: "string" }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: longtext("description").notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimCalendarId: primaryKey({
        columns: [table.id],
        name: "hrim_calendar_id",
      }),
    };
  },
);

export const hrimCalenderUsers = mysqlTable(
  "hrim_calender_users",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    calendarId: bigint("calendar_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimCalendar.id),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimCalenderUsersId: primaryKey({
        columns: [table.id],
        name: "hrim_calender_users_id",
      }),
    };
  },
);

export const hrimCharacterReference = mysqlTable(
  "hrim_character_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    name: varchar("name", { length: 255 }),
    position: varchar("position", { length: 255 }),
    company: varchar("company", { length: 255 }),
    mobileNumber: varchar("mobile_number", { length: 255 }),
    telephoneNumber: varchar("telephone_number", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimCharacterReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_character_reference_id",
      }),
    };
  },
);

export const hrimCocSectionReference = mysqlTable(
  "hrim_coc_section_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimCocSectionReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_coc_section_reference_id",
      }),
    };
  },
);

export const hrimCoreValue = mysqlTable(
  "hrim_core_value",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    description: longtext("description").notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimCoreValueId: primaryKey({
        columns: [table.id],
        name: "hrim_core_value_id",
      }),
    };
  },
);

export const hrimCutoffCategoryReference = mysqlTable(
  "hrim_cutoff_category_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimCutoffCategoryReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_cutoff_category_reference_id",
      }),
    };
  },
);

export const hrimCutoffManagement = mysqlTable(
  "hrim_cutoff_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    categoryId: int("category_id").notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    cutoffDate: date("cutoff_date", { mode: "string" }).notNull(),
    payoutYear: int("payout_year").notNull(),
    payoutMonth: int("payout_month").notNull(),
    payoutCutoff: int("payout_cutoff").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimCutoffManagementId: primaryKey({
        columns: [table.id],
        name: "hrim_cutoff_management_id",
      }),
    };
  },
);

export const hrimDateCategoryReference = mysqlTable(
  "hrim_date_category_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    ratePercentage: double("rate_percentage", {
      precision: 11,
      scale: 2,
    }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimDateCategoryReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_date_category_reference_id",
      }),
    };
  },
);

export const hrimDepartments = mysqlTable(
  "hrim_departments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    divisionId: bigint("division_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimDepartmentsId: primaryKey({
        columns: [table.id],
        name: "hrim_departments_id",
      }),
    };
  },
);

export const hrimDisciplinaryAttachments = mysqlTable(
  "hrim_disciplinary_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    disciplinaryId: bigint("disciplinary_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimDisciplinaryHistory.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimDisciplinaryAttachmentsId: primaryKey({
        columns: [table.id],
        name: "hrim_disciplinary_attachments_id",
      }),
    };
  },
);

export const hrimDisciplinaryHistory = mysqlTable(
  "hrim_disciplinary_history",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    incidentDate: date("incident_date", { mode: "string" }).notNull(),
    incidentTime: time("incident_time").notNull(),
    description: longtext("description").notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    incidentBranch: bigint("incident_branch", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => branchReference.id),
    cocSectionId: bigint("coc_section_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimCocSectionReference.id),
    violationId: bigint("violation_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimViolationReference.id),
    disciplinaryRecordId: bigint("disciplinary_record_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimDisciplinaryRecordReference.id),
    sanctionId: bigint("sanction_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimSanctionReference.id),
    sanctionStatusId: bigint("sanction_status_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimSanctionStatusReference.id),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimDisciplinaryHistoryId: primaryKey({
        columns: [table.id],
        name: "hrim_disciplinary_history_id",
      }),
    };
  },
);

export const hrimDisciplinaryRecordReference = mysqlTable(
  "hrim_disciplinary_record_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimDisciplinaryRecordReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_disciplinary_record_reference_id",
      }),
    };
  },
);

export const hrimDlb = mysqlTable(
  "hrim_dlb",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    year: int("year"),
    month: int("month"),
    payoutCutoff: int("payout_cutoff"),
    amount: double("amount", { precision: 11, scale: 2 }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimDlbId: primaryKey({ columns: [table.id], name: "hrim_dlb_id" }),
    };
  },
);

export const hrimEaLevelReference = mysqlTable(
  "hrim_ea_level_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEaLevelReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_ea_level_reference_id",
      }),
    };
  },
);

export const hrimEarnings = mysqlTable(
  "hrim_earnings",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    basicPay: double("basic_pay", { precision: 11, scale: 2 }),
    cola: double("cola", { precision: 11, scale: 2 }),
    grossPay: double("gross_pay", { precision: 11, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEarningsId: primaryKey({
        columns: [table.id],
        name: "hrim_earnings_id",
      }),
    };
  },
);

export const hrimEcdRelationshipReference = mysqlTable(
  "hrim_ecd_relationship_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEcdRelationshipReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_ecd_relationship_reference_id",
      }),
    };
  },
);

export const hrimEducationalAttainment = mysqlTable(
  "hrim_educational_attainment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    eaLevelId: bigint("ea_level_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimEaLevelReference.id),
    educationalInstitution: varchar("educational_institution", { length: 255 }),
    inclusiveYearFrom: int("inclusive_year_from"),
    inclusiveYearTo: int("inclusive_year_to"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEducationalAttainmentId: primaryKey({
        columns: [table.id],
        name: "hrim_educational_attainment_id",
      }),
    };
  },
);

export const hrimEmergencyContactDetails = mysqlTable(
  "hrim_emergency_contact_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    name: varchar("name", { length: 255 }),
    ecdRelationshipId: varchar("ecd_relationship_id", { length: 255 }),
    address: varchar("address", { length: 255 }),
    mobileNumber: varchar("mobile_number", { length: 255 }),
    telephoneNumber: varchar("telephone_number", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      ecdRelationshipIdForeign: index(
        "hrim_emergency_contact_details_ecd_relationship_id_foreign",
      ).on(table.ecdRelationshipId),
      hrimEmergencyContactDetailsId: primaryKey({
        columns: [table.id],
        name: "hrim_emergency_contact_details_id",
      }),
    };
  },
);

export const hrimEmployeeRequisition = mysqlTable(
  "hrim_employee_requisition",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    erfReferenceNo: varchar("erf_reference_no", { length: 255 }).notNull(),
    branchId: bigint("branch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    positionId: bigint("position_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimPositions.id),
    jobLevelId: bigint("job_level_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimJobLevels.id),
    employmentCategoryId: bigint("employment_category_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    employmentTypeId: bigint("employment_type_id", {
      mode: "number",
      unsigned: true,
    }),
    projectName: varchar("project_name", { length: 255 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    durationFrom: date("duration_from", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    durationTo: date("duration_to", { mode: "string" }),
    requisitionReasonId: bigint("requisition_reason_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimRequisitionReason.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    targetHire: date("target_hire", { mode: "string" }).notNull(),
    firstApprover: bigint("first_approver", { mode: "number", unsigned: true }),
    secondApprover: bigint("second_approver", {
      mode: "number",
      unsigned: true,
    }),
    firstStatus: bigint("first_status", { mode: "number", unsigned: true }),
    secondStatus: bigint("second_status", { mode: "number", unsigned: true }),
    finalStatus: bigint("final_status", { mode: "number", unsigned: true }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    firstApprovalDate: date("first_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    secondApprovalDate: date("second_approval_date", { mode: "string" }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      employmentCategoryIdForeign: index(
        "hrim_employee_requisition_employment_category_id_foreign",
      ).on(table.employmentCategoryId),
      employmentTypeIdForeign: index(
        "hrim_employee_requisition_employment_type_id_foreign",
      ).on(table.employmentTypeId),
      hrimEmployeeRequisitionId: primaryKey({
        columns: [table.id],
        name: "hrim_employee_requisition_id",
      }),
    };
  },
);

export const hrimEmployerCompliance = mysqlTable(
  "hrim_employer_compliance",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    path: varchar("path", { length: 255 }),
    name: varchar("name", { length: 255 }),
    extension: varchar("extension", { length: 255 }),
    title: varchar("title", { length: 255 }),
    description: longtext("description"),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEmployerComplianceId: primaryKey({
        columns: [table.id],
        name: "hrim_employer_compliance_id",
      }),
    };
  },
);

export const hrimEmploymentCategory = mysqlTable(
  "hrim_employment_category",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    sickLeave: double("sick_leave", { precision: 11, scale: 2 }).notNull(),
    vacationLeave: double("vacation_leave", {
      precision: 11,
      scale: 2,
    }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEmploymentCategoryId: primaryKey({
        columns: [table.id],
        name: "hrim_employment_category_id",
      }),
    };
  },
);

export const hrimEmploymentCategoryType = mysqlTable(
  "hrim_employment_category_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    employmentCategoryId: bigint("employment_category_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimEmploymentCategory.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEmploymentCategoryTypeId: primaryKey({
        columns: [table.id],
        name: "hrim_employment_category_type_id",
      }),
    };
  },
);

export const hrimEmploymentRecord = mysqlTable(
  "hrim_employment_record",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    employer: varchar("employer", { length: 255 }),
    position: varchar("position", { length: 255 }),
    inclusiveYearFrom: int("inclusive_year_from"),
    inclusiveYearTo: int("inclusive_year_to"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEmploymentRecordId: primaryKey({
        columns: [table.id],
        name: "hrim_employment_record_id",
      }),
    };
  },
);

export const hrimEmploymentStatus = mysqlTable(
  "hrim_employment_status",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEmploymentStatusId: primaryKey({
        columns: [table.id],
        name: "hrim_employment_status_id",
      }),
    };
  },
);

export const hrimEvaluatorManagement = mysqlTable(
  "hrim_evaluator_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    firstApprover: bigint("first_approver", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    secondApprover: bigint("second_approver", { mode: "number" }),
    thirdApprover: bigint("third_approver", { mode: "number" }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEvaluatorManagementId: primaryKey({
        columns: [table.id],
        name: "hrim_evaluator_management_id",
      }),
    };
  },
);

export const hrimEventTypeReference = mysqlTable(
  "hrim_event_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimEventTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_event_type_reference_id",
      }),
    };
  },
);

export const hrimFamilyInformation = mysqlTable(
  "hrim_family_information",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    fathersName: varchar("fathers_name", { length: 255 }),
    mothersMaidenName: varchar("mothers_maiden_name", { length: 255 }),
    spouse: varchar("spouse", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimFamilyInformationId: primaryKey({
        columns: [table.id],
        name: "hrim_family_information_id",
      }),
    };
  },
);

export const hrimFamilyInformationChildren = mysqlTable(
  "hrim_family_information_children",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    familyInformationId: bigint("family_information_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimFamilyInformation.id),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimFamilyInformationChildrenId: primaryKey({
        columns: [table.id],
        name: "hrim_family_information_children_id",
      }),
    };
  },
);

export const hrimFamilyInformationSibling = mysqlTable(
  "hrim_family_information_sibling",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    familyInformationId: bigint("family_information_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimFamilyInformation.id),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimFamilyInformationSiblingId: primaryKey({
        columns: [table.id],
        name: "hrim_family_information_sibling_id",
      }),
    };
  },
);

export const hrimGender = mysqlTable(
  "hrim_gender",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimGenderId: primaryKey({ columns: [table.id], name: "hrim_gender_id" }),
    };
  },
);

export const hrimGovernmentInformation = mysqlTable(
  "hrim_government_information",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    sssNo: varchar("sss_no", { length: 255 }),
    pagibigNo: varchar("pagibig_no", { length: 255 }),
    philhealthNo: varchar("philhealth_no", { length: 255 }),
    tinNo: varchar("tin_no", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimGovernmentInformationId: primaryKey({
        columns: [table.id],
        name: "hrim_government_information_id",
      }),
    };
  },
);

export const hrimHoliday = mysqlTable(
  "hrim_holiday",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    date: date("date", { mode: "string" }),
    branchId: int("branch_id"),
    typeId: bigint("type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimHolidayType.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      branchIdForeign: index("hrim_holiday_branch_id_foreign").on(
        table.branchId,
      ),
      hrimHolidayId: primaryKey({
        columns: [table.id],
        name: "hrim_holiday_id",
      }),
    };
  },
);

export const hrimHolidayType = mysqlTable(
  "hrim_holiday_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimHolidayTypeId: primaryKey({
        columns: [table.id],
        name: "hrim_holiday_type_id",
      }),
    };
  },
);

export const hrimJobLevels = mysqlTable(
  "hrim_job_levels",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimJobLevelsId: primaryKey({
        columns: [table.id],
        name: "hrim_job_levels_id",
      }),
    };
  },
);

export const hrimKpi = mysqlTable(
  "hrim_kpi",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    quarter: int("quarter").notNull(),
    year: int("year").notNull(),
    points: int("points").notNull(),
    target: varchar("target", { length: 255 }),
    remarks: longtext("remarks"),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimKpiId: primaryKey({ columns: [table.id], name: "hrim_kpi_id" }),
    };
  },
);

export const hrimKpiTagged = mysqlTable(
  "hrim_kpi_tagged",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    positionId: bigint("position_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimPositions.id),
    quarter: int("quarter").notNull(),
    year: int("year").notNull(),
    kraId: bigint("kra_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimKra.id),
    kpiId: bigint("kpi_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimKpi.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimKpiTaggedId: primaryKey({
        columns: [table.id],
        name: "hrim_kpi_tagged_id",
      }),
    };
  },
);

export const hrimKra = mysqlTable(
  "hrim_kra",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: bigint("type", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimJobLevels.id),
    quarter: int("quarter").notNull(),
    year: int("year").notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimKraId: primaryKey({ columns: [table.id], name: "hrim_kra_id" }),
    };
  },
);

export const hrimKraPoints = mysqlTable(
  "hrim_kra_points",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    points: int("points").notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    quarter: int("quarter").notNull(),
    year: int("year").notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimKraPointsId: primaryKey({
        columns: [table.id],
        name: "hrim_kra_points_id",
      }),
    };
  },
);

export const hrimLeadershipCompetencies = mysqlTable(
  "hrim_leadership_competencies",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    description: longtext("description").notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLeadershipCompetenciesId: primaryKey({
        columns: [table.id],
        name: "hrim_leadership_competencies_id",
      }),
    };
  },
);

export const hrimLeave = mysqlTable(
  "hrim_leave",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    inclusiveDateFrom: date("inclusive_date_from", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    inclusiveDateTo: date("inclusive_date_to", { mode: "string" }),
    days: int("days").notNull(),
    points: double("points", { precision: 11, scale: 2 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    resumeDate: date("resume_date", { mode: "string" }),
    leaveTypeId: bigint("leave_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimLeaveTypeReference.id),
    other: varchar("other", { length: 255 }),
    isWithMedicalCertificate: tinyint("is_with_medical_certificate"),
    leaveDayTypeId: bigint("leave_day_type_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimLeaveDayTypeReference.id),
    isWithPay: tinyint("is_with_pay"),
    reason: longtext("reason"),
    reliever: bigint("reliever", { mode: "number", unsigned: true }).references(
      () => users.id,
    ),
    firstApprover: bigint("first_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    secondApprover: bigint("second_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    thirdApprover: bigint("third_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    adminApprover: bigint("admin_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    firstStatus: tinyint("first_status"),
    secondStatus: tinyint("second_status"),
    thirdStatus: tinyint("third_status"),
    adminStatus: tinyint("admin_status"),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .default(1)
      .notNull()
      .references(() => hrimStatusReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    firstApprovalDate: date("first_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    secondApprovalDate: date("second_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    thirdApprovalDate: date("third_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    adminApprovalDate: date("admin_approval_date", { mode: "string" }),
    firstApproverRemarks: longtext("first_approver_remarks"),
    secondApproverRemarks: longtext("second_approver_remarks"),
    thirdApproverRemarks: longtext("third_approver_remarks"),
    adminApproverRemarks: longtext("admin_approver_remarks"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLeaveId: primaryKey({ columns: [table.id], name: "hrim_leave_id" }),
    };
  },
);

export const hrimLeaveAttachments = mysqlTable(
  "hrim_leave_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    leaveId: bigint("leave_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimLeave.id),
    originalName: varchar("original_name", { length: 255 }),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLeaveAttachmentsId: primaryKey({
        columns: [table.id],
        name: "hrim_leave_attachments_id",
      }),
    };
  },
);

export const hrimLeaveDayTypeReference = mysqlTable(
  "hrim_leave_day_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    points: varchar("points", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLeaveDayTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_leave_day_type_reference_id",
      }),
    };
  },
);

export const hrimLeaveDetails = mysqlTable(
  "hrim_leave_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    leaveId: int("leave_id"),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    leaveDate: date("leave_date", { mode: "string" }).notNull(),
    leaveType: int("leave_type").notNull(),
    applyFor: decimal("apply_for", { precision: 11, scale: 1 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLeaveDetailsId: primaryKey({
        columns: [table.id],
        name: "hrim_leave_details_id",
      }),
    };
  },
);

export const hrimLeaveTypeReference = mysqlTable(
  "hrim_leave_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLeaveTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_leave_type_reference_id",
      }),
    };
  },
);

export const hrimLoaAdjustmentManagement = mysqlTable(
  "hrim_loa_adjustment_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    minAmount: decimal("min_amount", { precision: 8, scale: 2 }).notNull(),
    maxAmount: decimal("max_amount", { precision: 8, scale: 2 }).notNull(),
    categoryId: bigint("category_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimAdminAdjCategoryReference.id),
    approverId: bigint("approver_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLoaAdjustmentManagementId: primaryKey({
        columns: [table.id],
        name: "hrim_loa_adjustment_management_id",
      }),
    };
  },
);

export const hrimLoaManagement = mysqlTable(
  "hrim_loa_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    branchId: bigint("branch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReference.id),
    loaTypeId: bigint("loa_type_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimLoaTypeReference.id),
    firstApprover: bigint("first_approver", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    secondApprover: bigint("second_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    thirdApprover: bigint("third_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    departmentId: bigint("department_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimDepartments.id),
  },
  (table) => {
    return {
      hrimLoaManagementId: primaryKey({
        columns: [table.id],
        name: "hrim_loa_management_id",
      }),
    };
  },
);

export const hrimLoaTypeReference = mysqlTable(
  "hrim_loa_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLoaTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_loa_type_reference_id",
      }),
    };
  },
);

export const hrimLoan = mysqlTable(
  "hrim_loan",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    referenceNo: varchar("reference_no", { length: 255 }).notNull(),
    type: bigint("type", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimLoanType.id),
    principalAmount: double("principal_amount", {
      precision: 8,
      scale: 2,
    }).notNull(),
    interest: int("interest").notNull(),
    terms: int("terms").notNull(),
    termType: int("term_type").notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    startDate: date("start_date", { mode: "string" }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    endDate: date("end_date", { mode: "string" }).notNull(),
    purpose: longtext("purpose"),
    overruleApprover: int("overrule_approver"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    overruleApprovalDate: date("overrule_approval_date", { mode: "string" }),
    firstApprover: bigint("first_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimLoaManagement.firstApprover),
    secondApprover: bigint("second_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimLoaManagement.secondApprover),
    thirdApprover: bigint("third_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimLoaManagement.thirdApprover),
    firstStatus: int("first_status"),
    secondStatus: int("second_status"),
    thirdStatus: int("third_status"),
    finalStatus: int("final_status"),
    approvedAmount: double("approved_amount", { precision: 11, scale: 2 }),
    declineReason: longtext("decline_reason"),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLoanId: primaryKey({ columns: [table.id], name: "hrim_loan_id" }),
    };
  },
);

export const hrimLoanDetails = mysqlTable(
  "hrim_loan_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    loanId: bigint("loan_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimLoan.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    paymentDate: date("payment_date", { mode: "string" }),
    year: int("year").notNull(),
    month: int("month").notNull(),
    cutoff: int("cutoff").notNull(),
    amount: double("amount", { precision: 8, scale: 2 }).notNull(),
    interest: int("interest").notNull(),
    status: int("status").notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLoanDetailsId: primaryKey({
        columns: [table.id],
        name: "hrim_loan_details_id",
      }),
    };
  },
);

export const hrimLoanType = mysqlTable(
  "hrim_loan_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    loanTypeCategory: int("loan_type_category").notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimLoanTypeId: primaryKey({
        columns: [table.id],
        name: "hrim_loan_type_id",
      }),
    };
  },
);

export const hrimMemoAttachments = mysqlTable(
  "hrim_memo_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    memoId: bigint("memo_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimMemos.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimMemoAttachmentsId: primaryKey({
        columns: [table.id],
        name: "hrim_memo_attachments_id",
      }),
    };
  },
);

export const hrimMemos = mysqlTable(
  "hrim_memos",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    memorandumNo: varchar("memorandum_no", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    datePosted: date("date_posted", { mode: "string" }).notNull(),
    attentionTo: bigint("attention_to", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    title: varchar("title", { length: 255 }).notNull(),
    details: longtext("details").notNull(),
    postedBy: bigint("posted_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimMemosId: primaryKey({ columns: [table.id], name: "hrim_memos_id" }),
    };
  },
);

export const hrimOnboarding = mysqlTable(
  "hrim_onboarding",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    erfReferenceNoId: bigint("erf_reference_no_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimEmployeeRequisition.id),
    firstname: varchar("firstname", { length: 255 }).notNull(),
    middlename: varchar("middlename", { length: 255 }).notNull(),
    lastname: varchar("lastname", { length: 255 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateApplied: date("date_applied", { mode: "string" }).notNull(),
    statusId: bigint("status_id", { mode: "number", unsigned: true }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    secondApprovalDate: date("2nd_approval_date", { mode: "string" }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimOnboardingId: primaryKey({
        columns: [table.id],
        name: "hrim_onboarding_id",
      }),
    };
  },
);

export const hrimOnboardingStatus = mysqlTable(
  "hrim_onboarding_status",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimOnboardingStatusId: primaryKey({
        columns: [table.id],
        name: "hrim_onboarding_status_id",
      }),
    };
  },
);

export const hrimOvertime = mysqlTable(
  "hrim_overtime",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    timeLogId: bigint("time_log_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimTimeLog.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateTimeFrom: date("date_time_from", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateTimeTo: date("date_time_to", { mode: "string" }),
    timeFrom: time("time_from"),
    timeTo: time("time_to"),
    overtimeRendered: double("overtime_rendered"),
    overtimeRequest: double("overtime_request"),
    overtimeApproved: double("overtime_approved"),
    dateCategoryId: bigint("date_category_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimDateCategoryReference.id),
    reason: longtext("reason"),
    firstApprover: bigint("first_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    secondApprover: bigint("second_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    thirdApprover: bigint("third_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    adminApprover: bigint("admin_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    firstStatus: tinyint("first_status"),
    secondStatus: tinyint("second_status"),
    thirdStatus: tinyint("third_status"),
    adminStatus: tinyint("admin_status"),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .default(1)
      .notNull()
      .references(() => hrimStatusReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    firstApprovalDate: date("first_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    secondApprovalDate: date("second_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    thirdApprovalDate: date("third_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    adminApprovalDate: date("admin_approval_date", { mode: "string" }),
    firstApproverRemarks: longtext("first_approver_remarks"),
    secondApproverRemarks: longtext("second_approver_remarks"),
    thirdApproverRemarks: longtext("third_approver_remarks"),
    adminApproverRemarks: longtext("admin_approver_remarks"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      overtimeTypeIdForeign: index("hrim_overtime_overtime_type_id_foreign").on(
        table.dateCategoryId,
      ),
      hrimOvertimeId: primaryKey({
        columns: [table.id],
        name: "hrim_overtime_id",
      }),
    };
  },
);

export const hrimPagibig = mysqlTable(
  "hrim_pagibig",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    year: int("year"),
    share: double("share"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimPagibigId: primaryKey({
        columns: [table.id],
        name: "hrim_pagibig_id",
      }),
    };
  },
);

export const hrimPayrollHistory = mysqlTable(
  "hrim_payroll_history",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    month: int("month").notNull(),
    cutoff: int("cutoff").notNull(),
    year: int("year").notNull(),
    employeeId: int("employee_id").notNull(),
    employeeCode: varchar("employee_code", { length: 255 }),
    bankAccount: varchar("bank_account", { length: 255 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateHired: date("date_hired", { mode: "string" }).notNull(),
    employmentStatus: int("employment_status").notNull(),
    jobRank: int("job_rank").notNull(),
    position: int("position").notNull(),
    branch: int("branch").notNull(),
    basicPay: double("basic_pay", { precision: 11, scale: 2 }),
    cola: double("cola", { precision: 11, scale: 2 }),
    grossPay: double("gross_pay", { precision: 11, scale: 2 }),
    holidayPay: double("holiday_pay", { precision: 11, scale: 2 }),
    ndPay: double("nd_pay", { precision: 11, scale: 2 }),
    otPay: double("ot_pay", { precision: 11, scale: 2 }),
    holidayOtPay: double("holiday_ot_pay", { precision: 11, scale: 2 }),
    specialOtPay: double("special_ot_pay", { precision: 11, scale: 2 }),
    restdayOtPay: double("restday_ot_pay", { precision: 11, scale: 2 }),
    restdayPay: double("restday_pay", { precision: 11, scale: 2 }),
    leaveWtPay: double("leave_wt_pay", { precision: 11, scale: 2 }),
    leaveWoPay: double("leave_wo_pay", { precision: 11, scale: 2 }),
    tardiness: double("tardiness", { precision: 11, scale: 2 }),
    undertime: double("undertime", { precision: 11, scale: 2 }),
    absence: double("absence", { precision: 11, scale: 2 }),
    governmentContriSss: double("government_contri_sss", {
      precision: 11,
      scale: 2,
    }),
    governmentContriPhilhealth: double("government_contri_philhealth", {
      precision: 11,
      scale: 2,
    }),
    governmentContriPagibig: double("government_contri_pagibig", {
      precision: 11,
      scale: 2,
    }),
    governmentLoansSss: double("government_loans_sss", {
      precision: 11,
      scale: 2,
    }),
    governmentLoansPhilhealth: double("government_loans_philhealth", {
      precision: 11,
      scale: 2,
    }),
    governmentLoansPagibig: double("government_loans_pagibig", {
      precision: 11,
      scale: 2,
    }),
    tax: double("tax", { precision: 11, scale: 2 }),
    otherLoansDeductions: double("other_loans_deductions", {
      precision: 11,
      scale: 2,
    }),
    adminAdjustments: double("admin_adjustments", { precision: 11, scale: 2 }),
    dlb: double("dlb", { precision: 11, scale: 2 }),
    netPay: double("net_pay", { precision: 11, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimPayrollHistoryId: primaryKey({
        columns: [table.id],
        name: "hrim_payroll_history_id",
      }),
    };
  },
);

export const hrimPayrollStatus = mysqlTable(
  "hrim_payroll_status",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    month: int("month").notNull(),
    cutoff: int("cutoff").notNull(),
    year: int("year").notNull(),
    payrollStatus: int("payroll_status"),
    initialPayslipStatus: int("initial_payslip_status"),
    finalPayslipStatus: int("final_payslip_status"),
    bankFileStatus: int("bank_file_status"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    payrollUpdatedAt: date("payroll_updated_at", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    initialPayslipUpdatedAt: date("initial_payslip_updated_at", {
      mode: "string",
    }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    finalPayslipUpdatedAt: date("final_payslip_updated_at", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    bankFileUpdatedAt: date("bank_file_updated_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimPayrollStatusId: primaryKey({
        columns: [table.id],
        name: "hrim_payroll_status_id",
      }),
    };
  },
);

export const hrimPerformanceBreakdownPct = mysqlTable(
  "hrim_performance_breakdown_pct",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    jobLevelId: bigint("job_level_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimJobLevels.id),
    goals: int("goals").notNull(),
    coreValues: int("core_values").notNull(),
    leadershipCompetencies: int("leadership_competencies").notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimPerformanceBreakdownPctId: primaryKey({
        columns: [table.id],
        name: "hrim_performance_breakdown_pct_id",
      }),
    };
  },
);

export const hrimPerformanceEvaluation = mysqlTable(
  "hrim_performance_evaluation",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    positionId: bigint("position_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimPositions.id),
    kraId: bigint("kra_id", { mode: "number", unsigned: true }),
    kpiId: bigint("kpi_id", { mode: "number", unsigned: true }),
    coreValuesId: bigint("core_values_id", { mode: "number", unsigned: true }),
    leadershipCompId: bigint("leadership_comp_id", {
      mode: "number",
      unsigned: true,
    }),
    firstPoints: int("first_points"),
    secondPoints: int("second_points"),
    thirdPoints: int("third_points"),
    employeeSelfPoints: int("employee_self_points"),
    firstStatus: int("first_status"),
    secondStatus: int("second_status"),
    thirdStatus: int("third_status"),
    employeeEvalStatus: int("employee_eval_status"),
    firstEvaluator: bigint("first_evaluator", {
      mode: "number",
      unsigned: true,
    }),
    secondEvaluator: bigint("second_evaluator", {
      mode: "number",
      unsigned: true,
    }),
    thirdEvaluator: bigint("third_evaluator", {
      mode: "number",
      unsigned: true,
    }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    firstEvalDate: date("first_eval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    secondEvalDate: date("second_eval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    thirdEvalDate: date("third_eval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    employeeEvalDate: date("employee_eval_date", { mode: "string" }),
    firstRemarks: longtext("first_remarks"),
    secondRemarks: longtext("second_remarks"),
    thirdRemarks: longtext("third_remarks"),
    employeeRemarks: longtext("employee_remarks"),
    criticalRemarks: longtext("critical_remarks"),
    coreVal1StCriticalRemarks: longtext("core_val_1st_critical_remarks"),
    coreVal2NdCriticalRemarks: longtext("core_val_2nd_critical_remarks"),
    coreVal3RdCriticalRemarks: longtext("core_val_3rd_critical_remarks"),
    leadCom1StCriticalRemarks: longtext("lead_com_1st_critical_remarks"),
    leadCom2NdCriticalRemarks: longtext("lead_com_2nd_critical_remarks"),
    leadCom3RdCriticalRemarks: longtext("lead_com_3rd_critical_remarks"),
    userIdRemarks: bigint("user_id_remarks", {
      mode: "number",
      unsigned: true,
    }),
    firstJustification: longtext("first_justification"),
    secondJustification: longtext("second_justification"),
    thirdJustification: longtext("third_justification"),
    performanceTotalScore: double("performance_total_score", {
      precision: 5,
      scale: 2,
    }),
    coreValueTotalScore: double("core_value_total_score", {
      precision: 5,
      scale: 2,
    }),
    leadershipTotalScore: double("leadership_total_score", {
      precision: 5,
      scale: 2,
    }),
    overallTotalScore: double("overall_total_score", {
      precision: 5,
      scale: 2,
    }),
    finalScore: double("final_score", { precision: 5, scale: 2 }),
    quarter: int("quarter").notNull(),
    year: int("year").notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimPerformanceEvaluationId: primaryKey({
        columns: [table.id],
        name: "hrim_performance_evaluation_id",
      }),
    };
  },
);

export const hrimPhilhealth = mysqlTable(
  "hrim_philhealth",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    year: int("year"),
    premiumRate: decimal("premium_rate", { precision: 11, scale: 3 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimPhilhealthId: primaryKey({
        columns: [table.id],
        name: "hrim_philhealth_id",
      }),
    };
  },
);

export const hrimPositionJobRequirements = mysqlTable(
  "hrim_position_job_requirements",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: longtext("code").notNull(),
    positionId: bigint("position_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimPositions.id),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimPositionJobRequirementsId: primaryKey({
        columns: [table.id],
        name: "hrim_position_job_requirements_id",
      }),
    };
  },
);

export const hrimPositionResponsibilities = mysqlTable(
  "hrim_position_responsibilities",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    duties: longtext("duties").notNull(),
    positionId: bigint("position_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimPositions.id),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimPositionResponsibilitiesId: primaryKey({
        columns: [table.id],
        name: "hrim_position_responsibilities_id",
      }),
    };
  },
);

export const hrimPositions = mysqlTable(
  "hrim_positions",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    jobLevelId: bigint("job_level_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimJobLevels.id),
    departmentLevelId: bigint("department_level_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimDepartments.id),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    jobOverview: longtext("job_overview").notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimPositionsId: primaryKey({
        columns: [table.id],
        name: "hrim_positions_id",
      }),
    };
  },
);

export const hrimProvince = mysqlTable(
  "hrim_province",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimProvinceId: primaryKey({
        columns: [table.id],
        name: "hrim_province_id",
      }),
    };
  },
);

export const hrimRequisitionAttachment = mysqlTable(
  "hrim_requisition_attachment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    requisitionId: bigint("requisition_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimEmployeeRequisition.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimRequisitionAttachmentId: primaryKey({
        columns: [table.id],
        name: "hrim_requisition_attachment_id",
      }),
    };
  },
);

export const hrimRequisitionReason = mysqlTable(
  "hrim_requisition_reason",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimRequisitionReasonId: primaryKey({
        columns: [table.id],
        name: "hrim_requisition_reason_id",
      }),
    };
  },
);

export const hrimResignationAttachments = mysqlTable(
  "hrim_resignation_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimResignationAttachmentsId: primaryKey({
        columns: [table.id],
        name: "hrim_resignation_attachments_id",
      }),
    };
  },
);

export const hrimResignationReason = mysqlTable(
  "hrim_resignation_reason",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateResignation: date("date_resignation", { mode: "string" }).notNull(),
    reasonDescription: longtext("reason_description").notNull(),
    reasonReferenceId: bigint("reason_reference_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimResignationReasonReference.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimResignationReasonId: primaryKey({
        columns: [table.id],
        name: "hrim_resignation_reason_id",
      }),
    };
  },
);

export const hrimResignationReasonReference = mysqlTable(
  "hrim_resignation_reason_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimResignationReasonReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_resignation_reason_reference_id",
      }),
    };
  },
);

export const hrimRestDay = mysqlTable(
  "hrim_rest_day",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    date: date("date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimRestDayId: primaryKey({
        columns: [table.id],
        name: "hrim_rest_day_id",
      }),
    };
  },
);

export const hrimSalaryGrade = mysqlTable(
  "hrim_salary_grade",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    grade: varchar("grade", { length: 255 }).notNull(),
    minimunAmount: double("minimun_amount", { precision: 11, scale: 2 }),
    maximumAmount: double("maximum_amount", { precision: 11, scale: 2 }),
    createdBy: bigint("created_by", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimSalaryGradeId: primaryKey({
        columns: [table.id],
        name: "hrim_salary_grade_id",
      }),
    };
  },
);

export const hrimSanctionReference = mysqlTable(
  "hrim_sanction_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimSanctionReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_sanction_reference_id",
      }),
    };
  },
);

export const hrimSanctionStatusReference = mysqlTable(
  "hrim_sanction_status_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimSanctionStatusReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_sanction_status_reference_id",
      }),
    };
  },
);

export const hrimScheduleAdjustment = mysqlTable(
  "hrim_schedule_adjustment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    currentWorkScheduleId: bigint("current_work_schedule_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimWorkSchedule.id),
    newWorkScheduleId: bigint("new_work_schedule_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimWorkSchedule.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    inclusiveDateFrom: date("inclusive_date_from", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    inclusiveDateTo: date("inclusive_date_to", { mode: "string" }),
    reason: longtext("reason"),
    firstApprover: bigint("first_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    secondApprover: bigint("second_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    thirdApprover: bigint("third_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    adminApprover: bigint("admin_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    firstStatus: tinyint("first_status"),
    secondStatus: tinyint("second_status"),
    thirdStatus: tinyint("third_status"),
    adminStatus: tinyint("admin_status"),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .default(1)
      .notNull()
      .references(() => hrimStatusReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    firstApprovalDate: date("first_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    secondApprovalDate: date("second_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    thirdApprovalDate: date("third_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    adminApprovalDate: date("admin_approval_date", { mode: "string" }),
    firstApproverRemarks: longtext("first_approver_remarks"),
    secondApproverRemarks: longtext("second_approver_remarks"),
    thirdApproverRemarks: longtext("third_approver_remarks"),
    adminApproverRemarks: longtext("admin_approver_remarks"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimScheduleAdjustmentId: primaryKey({
        columns: [table.id],
        name: "hrim_schedule_adjustment_id",
      }),
    };
  },
);

export const hrimSectionReference = mysqlTable(
  "hrim_section_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimSectionReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_section_reference_id",
      }),
    };
  },
);

export const hrimSocSectionReference = mysqlTable(
  "hrim_soc_section_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimSocSectionReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_soc_section_reference_id",
      }),
    };
  },
);

export const hrimSss = mysqlTable(
  "hrim_sss",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    year: int("year"),
    grosspayMin: double("grosspay_min", { precision: 11, scale: 2 }),
    grosspayMax: double("grosspay_max", { precision: 11, scale: 2 }),
    regularEr: double("regular_er", { precision: 11, scale: 2 }),
    regularEe: double("regular_ee", { precision: 11, scale: 2 }),
    compensationEr: double("compensation_er", { precision: 11, scale: 2 }),
    compensationEe: double("compensation_ee", { precision: 11, scale: 2 }),
    mandatoryEr: double("mandatory_er", { precision: 11, scale: 2 }),
    mandatoryEe: double("mandatory_ee", { precision: 11, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimSssId: primaryKey({ columns: [table.id], name: "hrim_sss_id" }),
    };
  },
);

export const hrimStatusReference = mysqlTable(
  "hrim_status_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimStatusReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_status_reference_id",
      }),
    };
  },
);

export const hrimStatutory = mysqlTable(
  "hrim_statutory",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    statutorBenefitType: varchar("statutor_benefit_type", {
      length: 255,
    }).notNull(),
    description: longtext("description").notNull(),
    createdBy: bigint("created_by", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimStatutoryId: primaryKey({
        columns: [table.id],
        name: "hrim_statutory_id",
      }),
    };
  },
);

export const hrimTar = mysqlTable(
  "hrim_tar",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    timeLogId: bigint("time_log_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimTimeLog.id),
    actualTimeIn: time("actual_time_in").notNull(),
    actualTimeOut: time("actual_time_out").notNull(),
    currentTimeIn: time("current_time_in"),
    currentTimeOut: time("current_time_out"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateFrom: date("date_from", { mode: "string" }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dateTo: date("date_to", { mode: "string" }),
    tarReasonId: bigint("tar_reason_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimTarReasonReference.id),
    firstApprover: bigint("first_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    secondApprover: bigint("second_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    thirdApprover: bigint("third_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    adminApprover: bigint("admin_approver", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    firstStatus: tinyint("first_status"),
    secondStatus: tinyint("second_status"),
    thirdStatus: tinyint("third_status"),
    adminStatus: tinyint("admin_status"),
    finalStatusId: bigint("final_status_id", { mode: "number", unsigned: true })
      .default(1)
      .notNull()
      .references(() => hrimStatusReference.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    firstApprovalDate: date("first_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    secondApprovalDate: date("second_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    thirdApprovalDate: date("third_approval_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    adminApprovalDate: date("admin_approval_date", { mode: "string" }),
    firstApproverRemarks: longtext("first_approver_remarks"),
    secondApproverRemarks: longtext("second_approver_remarks"),
    thirdApproverRemarks: longtext("third_approver_remarks"),
    adminApproverRemarks: longtext("admin_approver_remarks"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimTarId: primaryKey({ columns: [table.id], name: "hrim_tar_id" }),
    };
  },
);

export const hrimTarReasonReference = mysqlTable(
  "hrim_tar_reason_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimTarReasonReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_tar_reason_reference_id",
      }),
    };
  },
);

export const hrimTeams = mysqlTable(
  "hrim_teams",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    positionId: bigint("position_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimPositions.id),
    reportsTo: bigint("reports_to", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimPositions.id),
    departmentId: bigint("department_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimDepartments.id),
    sectionId: bigint("section_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimSectionReference.id),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimTeamsId: primaryKey({ columns: [table.id], name: "hrim_teams_id" }),
    };
  },
);

export const hrimTeamsAttachment = mysqlTable(
  "hrim_teams_attachment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimTeamsAttachmentId: primaryKey({
        columns: [table.id],
        name: "hrim_teams_attachment_id",
      }),
    };
  },
);

export const hrimTicketCategory = mysqlTable(
  "hrim_ticket_category",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    divisionId: int("division_id").notNull(),
    createdBy: int("created_by").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimTicketCategoryId: primaryKey({
        columns: [table.id],
        name: "hrim_ticket_category_id",
      }),
    };
  },
);

export const hrimTicketSubcategory = mysqlTable(
  "hrim_ticket_subcategory",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    divisionId: int("division_id").notNull(),
    categoryId: int("category_id").notNull(),
    sla: int("sla"),
    severity: int("severity"),
    createdBy: int("created_by").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimTicketSubcategoryId: primaryKey({
        columns: [table.id],
        name: "hrim_ticket_subcategory_id",
      }),
    };
  },
);

export const hrimTicketTaskHolder = mysqlTable(
  "hrim_ticket_task_holder",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    categoryId: bigint("category_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimTicketCategory.id),
    subcategoryId: bigint("subcategory_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimTicketSubcategory.id),
    divisionId: bigint("division_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimTicketTaskHolderId: primaryKey({
        columns: [table.id],
        name: "hrim_ticket_task_holder_id",
      }),
    };
  },
);

export const hrimTicketingSystem = mysqlTable(
  "hrim_ticketing_system",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    ticketReferenceNo: varchar("ticket_reference_no", {
      length: 255,
    }).notNull(),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    subject: longtext("subject").notNull(),
    categoryId: bigint("category_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimTicketCategory.id),
    subcategoryId: bigint("subcategory_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimTicketSubcategory.id),
    message: longtext("message").notNull(),
    taskHolder: int("task_holder").notNull(),
    requestedBy: int("requested_by").notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    actualStartDate: date("actual_start_date", { mode: "string" }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    actualEndDate: date("actual_end_date", { mode: "string" }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    targetEndDate: date("target_end_date", { mode: "string" }).notNull(),
    taskHolderStatus: int("task_holder_status").notNull(),
    requesterStatus: int("requester_status").notNull(),
    finalStatus: int("final_status").notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    taskHolderStatusDate: date("task_holder_status_date", {
      mode: "string",
    }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    requesterStatusDate: date("requester_status_date", {
      mode: "string",
    }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    finalStatusDate: date("final_status_date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimTicketingSystemId: primaryKey({
        columns: [table.id],
        name: "hrim_ticketing_system_id",
      }),
    };
  },
);

export const hrimTimeLog = mysqlTable(
  "hrim_time_log",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    workSchedId: bigint("work_sched_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimWorkSchedule.id),
    dateCategoryId: bigint("date_category_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => hrimDateCategoryReference.id),
    workModeId: bigint("work_mode_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimWorkModeReference.id),
    timeInImgPath: varchar("time_in_img_path", { length: 255 }),
    timeInImgName: varchar("time_in_img_name", { length: 255 }),
    timeIn: time("time_in"),
    timeOutImgPath: varchar("time_out_img_path", { length: 255 }),
    timeOutImgName: varchar("time_out_img_name", { length: 255 }),
    timeOut: time("time_out"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    timeOutDate: date("time_out_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    date: date("date", { mode: "string" }),
    renderedTime: double("rendered_time", { precision: 11, scale: 2 }),
    late: double("late", { precision: 11, scale: 2 }),
    undertime: double("undertime", { precision: 11, scale: 2 }),
    computedOt: double("computed_ot", { precision: 11, scale: 2 }),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimTimeLogId: primaryKey({
        columns: [table.id],
        name: "hrim_time_log_id",
      }),
    };
  },
);

export const hrimViolationReference = mysqlTable(
  "hrim_violation_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimViolationReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_violation_reference_id",
      }),
    };
  },
);

export const hrimWorkModeReference = mysqlTable(
  "hrim_work_mode_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: tinyint("is_visible"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimWorkModeReferenceId: primaryKey({
        columns: [table.id],
        name: "hrim_work_mode_reference_id",
      }),
    };
  },
);

export const hrimWorkSchedule = mysqlTable(
  "hrim_work_schedule",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    workModeId: bigint("work_mode_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => hrimWorkModeReference.id),
    shift: varchar("shift", { length: 255 }),
    monday: tinyint("monday").default(0).notNull(),
    tuesday: tinyint("tuesday").default(0).notNull(),
    wednesday: tinyint("wednesday").default(0).notNull(),
    thursday: tinyint("thursday").default(0).notNull(),
    friday: tinyint("friday").default(0).notNull(),
    saturday: tinyint("saturday").default(0).notNull(),
    sunday: tinyint("sunday").default(0).notNull(),
    timeFrom: time("time_from"),
    timeTo: time("time_to"),
    breakFrom: time("break_from"),
    breakTo: time("break_to"),
    otBreakFrom: time("ot_break_from"),
    otBreakTo: time("ot_break_to"),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      hrimWorkScheduleId: primaryKey({
        columns: [table.id],
        name: "hrim_work_schedule_id",
      }),
    };
  },
);

export const islandGroup = mysqlTable(
  "island_group",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      islandGroupId: primaryKey({
        columns: [table.id],
        name: "island_group_id",
      }),
    };
  },
);

export const levelReference = mysqlTable(
  "level_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: bigint("is_visible", { mode: "number", unsigned: true })
      .default(1)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      levelReferenceId: primaryKey({
        columns: [table.id],
        name: "level_reference_id",
      }),
    };
  },
);

export const migrations = mysqlTable(
  "migrations",
  {
    id: int("id", { unsigned: true }).autoincrement().notNull(),
    migration: varchar("migration", { length: 255 }).notNull(),
    batch: int("batch").notNull(),
  },
  (table) => {
    return {
      migrationsId: primaryKey({ columns: [table.id], name: "migrations_id" }),
    };
  },
);

export const monthReference = mysqlTable(
  "month_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      monthReferenceId: primaryKey({
        columns: [table.id],
        name: "month_reference_id",
      }),
    };
  },
);

export const notifications = mysqlTable(
  "notifications",
  {
    id: char("id", { length: 36 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    notifiableType: varchar("notifiable_type", { length: 255 }).notNull(),
    notifiableId: bigint("notifiable_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    data: text("data").notNull(),
    readAt: timestamp("read_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      notifiableTypeNotifiableIdIdx: index("idx").on(
        table.notifiableType,
        table.notifiableId,
      ),
      notificationsId: primaryKey({
        columns: [table.id],
        name: "notifications_id",
      }),
    };
  },
);

export const oauthAccessTokens = mysqlTable(
  "oauth_access_tokens",
  {
    id: varchar("id", { length: 100 }).notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }),
    clientId: bigint("client_id", { mode: "number", unsigned: true }).notNull(),
    name: varchar("name", { length: 255 }),
    scopes: text("scopes"),
    revoked: tinyint("revoked").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    expiresAt: datetime("expires_at", { mode: "string" }),
  },
  (table) => {
    return {
      userIdIdx: index("idx").on(table.userId),
      oauthAccessTokensId: primaryKey({
        columns: [table.id],
        name: "oauth_access_tokens_id",
      }),
    };
  },
);

export const oauthAuthCodes = mysqlTable(
  "oauth_auth_codes",
  {
    id: varchar("id", { length: 100 }).notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    clientId: bigint("client_id", { mode: "number", unsigned: true }).notNull(),
    scopes: text("scopes"),
    revoked: tinyint("revoked").notNull(),
    expiresAt: datetime("expires_at", { mode: "string" }),
  },
  (table) => {
    return {
      userIdIdx: index("idx").on(table.userId),
      oauthAuthCodesId: primaryKey({
        columns: [table.id],
        name: "oauth_auth_codes_id",
      }),
    };
  },
);

export const oauthClients = mysqlTable(
  "oauth_clients",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }),
    name: varchar("name", { length: 255 }).notNull(),
    secret: varchar("secret", { length: 100 }),
    provider: varchar("provider", { length: 255 }),
    redirect: text("redirect").notNull(),
    personalAccessClient: tinyint("personal_access_client").notNull(),
    passwordClient: tinyint("password_client").notNull(),
    revoked: tinyint("revoked").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      userIdIdx: index("idx").on(table.userId),
      oauthClientsId: primaryKey({
        columns: [table.id],
        name: "oauth_clients_id",
      }),
    };
  },
);

export const oauthPersonalAccessClients = mysqlTable(
  "oauth_personal_access_clients",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    clientId: bigint("client_id", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oauthPersonalAccessClientsId: primaryKey({
        columns: [table.id],
        name: "oauth_personal_access_clients_id",
      }),
    };
  },
);

export const oauthRefreshTokens = mysqlTable(
  "oauth_refresh_tokens",
  {
    id: varchar("id", { length: 100 }).notNull(),
    accessTokenId: varchar("access_token_id", { length: 100 }).notNull(),
    revoked: tinyint("revoked").notNull(),
    expiresAt: datetime("expires_at", { mode: "string" }),
  },
  (table) => {
    return {
      accessTokenIdIdx: index("idx").on(table.accessTokenId),
      oauthRefreshTokensId: primaryKey({
        columns: [table.id],
        name: "oauth_refresh_tokens_id",
      }),
    };
  },
);

export const oimsAgent = mysqlTable(
  "oims_agent",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsAgentId: primaryKey({ columns: [table.id], name: "oims_agent_id" }),
    };
  },
);

export const oimsAreaReference = mysqlTable(
  "oims_area_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    quadrantId: bigint("quadrant_id", {
      mode: "number",
      unsigned: true,
    }).references(() => branchReferencesQuadrant.id),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsAreaReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_area_reference_id",
      }),
    };
  },
);

export const oimsBranchReference = mysqlTable(
  "oims_branch_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    region: bigint("region", { mode: "number", unsigned: true })
      .notNull()
      .references(() => region.id),
    name: varchar("name", { length: 255 }).notNull(),
    address: longtext("address").notNull(),
    originDestinationId: bigint("origin_destination_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => branchReference.id),
    latitude: varchar("latitude", { length: 255 }).notNull(),
    longitude: varchar("longitude", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    default: tinyint("default").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsBranchReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_branch_reference_id",
      }),
    };
  },
);

export const oimsBranchReferenceContactNo = mysqlTable(
  "oims_branch_reference_contact_no",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    branchReferenceId: bigint("branch_reference_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => oimsBranchReference.id),
    contactNo: varchar("contact_no", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsBranchReferenceContactNoId: primaryKey({
        columns: [table.id],
        name: "oims_branch_reference_contact_no_id",
      }),
    };
  },
);

export const oimsBranchReferenceTelephone = mysqlTable(
  "oims_branch_reference_telephone",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    branchReferenceId: bigint("branch_reference_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => oimsBranchReference.id),
    telephone: varchar("telephone", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsBranchReferenceTelephoneId: primaryKey({
        columns: [table.id],
        name: "oims_branch_reference_telephone_id",
      }),
    };
  },
);

export const oimsCargoStatusReference = mysqlTable(
  "oims_cargo_status_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsCargoStatusReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_cargo_status_reference_id",
      }),
    };
  },
);

export const oimsDangerousGoodsReference = mysqlTable(
  "oims_dangerous_goods_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsDangerousGoodsReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_dangerous_goods_reference_id",
      }),
    };
  },
);

export const oimsEdtr = mysqlTable(
  "oims_edtr",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    referenceNo: varchar("reference_no", { length: 255 }).notNull(),
    traId: bigint("tra_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsTeamRouteAssignmentDetails.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dispatchDate: date("dispatch_date", { mode: "string" }).notNull(),
    branchId: bigint("branch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsBranchReference.id),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    requestedStartBreak: datetime("requested_start_break", { mode: "string" }),
    requestedEndBreak: datetime("requested_end_break", { mode: "string" }),
    actualStartBreak: datetime("actual_start_break", { mode: "string" }),
    actualEndBreak: datetime("actual_end_break", { mode: "string" }),
    breakApproval: datetime("break_approval", { mode: "string" }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsEdtrId: primaryKey({ columns: [table.id], name: "oims_edtr_id" }),
    };
  },
);

export const oimsEdtrDetails = mysqlTable(
  "oims_edtr_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    edtrId: bigint("edtr_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsEdtr.id),
    edtrItemId: bigint("edtr_item_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    edtrItemType: bigint("edtr_item_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    estimatedTimeTravel: time("estimated_time_travel").notNull(),
    estimatedTimeActivity: time("estimated_time_activity").notNull(),
    actualStartTravelTime: datetime("actual_start_travel_time", {
      mode: "string",
    }),
    actualEndTravelTime: datetime("actual_end_travel_time", { mode: "string" }),
    pickupConfirmedTime: datetime("pickup_confirmed_time", { mode: "string" }),
    pickupStartTime: datetime("pickup_start_time", { mode: "string" }),
    pickupEndTime: datetime("pickup_end_time", { mode: "string" }),
    deliveryStartTime: datetime("delivery_start_time", { mode: "string" }),
    deliveryEndTime: datetime("delivery_end_time", { mode: "string" }),
    deliveryStatus: int("delivery_status"),
    completedDate: datetime("completed_date", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsEdtrDetailsId: primaryKey({
        columns: [table.id],
        name: "oims_edtr_details_id",
      }),
    };
  },
);

export const oimsOdaOpaReference = mysqlTable(
  "oims_oda_opa_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsOdaOpaReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_oda_opa_reference_id",
      }),
    };
  },
);

export const oimsOriginDestinationPortReference = mysqlTable(
  "oims_origin_destination_port_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsOriginDestinationPortReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_origin_destination_port_reference_id",
      }),
    };
  },
);

export const oimsPaymodeReference = mysqlTable(
  "oims_paymode_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsPaymodeReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_paymode_reference_id",
      }),
    };
  },
);

export const oimsReasonApplicationReference = mysqlTable(
  "oims_reason_application_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsReasonApplicationReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_reason_application_reference_id",
      }),
    };
  },
);

export const oimsReasonReference = mysqlTable(
  "oims_reason_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    typeOfReason: int("type_of_reason").notNull(),
    applicationId: bigint("application_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsReasonApplicationReference.id),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsReasonReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_reason_reference_id",
      }),
    };
  },
);

export const oimsRemarksManagement = mysqlTable(
  "oims_remarks_management",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    typeOfRemarks: int("type_of_remarks").notNull(),
    transactionStageId: bigint("transaction_stage_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => oimsCargoStatusReference.id),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsRemarksManagementId: primaryKey({
        columns: [table.id],
        name: "oims_remarks_management_id",
      }),
    };
  },
);

export const oimsRouteCategoryReference = mysqlTable(
  "oims_route_category_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsRouteCategoryReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_route_category_reference_id",
      }),
    };
  },
);

export const oimsScopeOfWorkReferences = mysqlTable(
  "oims_scope_of_work_references",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsScopeOfWorkReferencesId: primaryKey({
        columns: [table.id],
        name: "oims_scope_of_work_references_id",
      }),
    };
  },
);

export const oimsServiceAreaCoverage = mysqlTable(
  "oims_service_area_coverage",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    islandGroupId: bigint("island_group_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => islandGroup.id),
    regionId: bigint("region_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => region.id),
    stateId: bigint("state_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => state.id),
    cityId: bigint("city_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => city.id),
    barangayId: bigint("barangay_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => barangay.id),
    zipcode: int("zipcode").notNull(),
    portToCaterId: bigint("port_to_cater_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => oimsBranchReference.id),
    serviceabilityId: bigint("serviceability_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => oimsServiceabilityReference.id),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsServiceAreaCoverageId: primaryKey({
        columns: [table.id],
        name: "oims_service_area_coverage_id",
      }),
    };
  },
);

export const oimsServiceModeReference = mysqlTable(
  "oims_service_mode_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => oimsTransportReference.id),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsServiceModeReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_service_mode_reference_id",
      }),
    };
  },
);

export const oimsServiceabilityReference = mysqlTable(
  "oims_serviceability_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    color: varchar("color", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsServiceabilityReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_serviceability_reference_id",
      }),
    };
  },
);

export const oimsTeamReference = mysqlTable(
  "oims_team_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    quadrantId: bigint("quadrant_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => branchReferencesQuadrant.id),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTeamReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_team_reference_id",
      }),
    };
  },
);

export const oimsTeamRouteAssignment = mysqlTable(
  "oims_team_route_assignment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    traNo: varchar("tra_no", { length: 255 }).notNull(),
    branchId: bigint("branch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsBranchReference.id),
    createdUserId: bigint("created_user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dispatchDate: date("dispatch_date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTeamRouteAssignmentId: primaryKey({
        columns: [table.id],
        name: "oims_team_route_assignment_id",
      }),
    };
  },
);

export const oimsTeamRouteAssignmentDetails = mysqlTable(
  "oims_team_route_assignment_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    teamRouteId: bigint("team_route_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsTeamRouteAssignment.id),
    teamId: bigint("team_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsTeamReference.id),
    plateNoId: bigint("plate_no_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsVehicle.id),
    vehicleType: bigint("vehicle_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    routeCategoryId: bigint("route_category_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => oimsRouteCategoryReference.id),
    driverId: bigint("driver_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    checker1Id: bigint("checker1_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    checker2Id: bigint("checker2_id", {
      mode: "number",
      unsigned: true,
    }).references(() => users.id),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dispatchDate: date("dispatch_date", { mode: "string" }).notNull(),
    remarks: longtext("remarks"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTeamRouteAssignmentDetailsId: primaryKey({
        columns: [table.id],
        name: "oims_team_route_assignment_details_id",
      }),
    };
  },
);

export const oimsTransactionEntry = mysqlTable(
  "oims_transaction_entry",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybill: varchar("waybill", { length: 255 }).notNull(),
    scopeOfWork: bigint("scope_of_work", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    transactionDate: date("transaction_date", { mode: "string" }).notNull(),
    transactionType: bigint("transaction_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    bookingReferenceId: bigint("booking_reference_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    bookingTypeId: bigint("booking_type_id", {
      mode: "number",
      unsigned: true,
    }),
    branchId: bigint("branch_id", { mode: "number", unsigned: true }).notNull(),
    originId: bigint("origin_id", { mode: "number", unsigned: true }).notNull(),
    destinationId: bigint("destination_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    transhipmentId: bigint("transhipment_id", {
      mode: "number",
      unsigned: true,
    }),
    transportModeId: bigint("transport_mode_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    shipperId: bigint("shipper_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    shipperContactPersonId: bigint("shipper_contact_person_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    shipperMobileNoId: bigint("shipper_mobile_no_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    shipperAddressId: bigint("shipper_address_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    shipperAddress: longtext("shipper_address").notNull(),
    consigneeId: bigint("consignee__id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    consigneeContactPersonId: bigint("consignee_contact_person_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    consigneeMobileNoId: bigint("consignee_mobile_no_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    consigneeAddressId: bigint("consignee_address_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    consigneeAddress: longtext("consignee_address").notNull(),
    batchNo: int("batch_no").notNull(),
    pickupNotation: varchar("pickup_notation", { length: 255 }).notNull(),
    transType: int("transType").notNull(),
    itemType: bigint("item_type", { mode: "number", unsigned: true }),
    commodityAppRate: bigint("commodity_app_rate", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    commodityType: bigint("commodity_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    typeOfGoods: bigint("type_of_goods", { mode: "number", unsigned: true }),
    paymode: bigint("paymode", { mode: "number", unsigned: true }).notNull(),
    serviceMode: bigint("service_mode", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    chargeToId: bigint("charge_to_id", { mode: "number", unsigned: true }),
    accountOwnerId: bigint("account_owner_id", {
      mode: "number",
      unsigned: true,
    }),
    preparedById: bigint("prepared_by_id", { mode: "number", unsigned: true }),
    qcById: bigint("qc_by_id", { mode: "number", unsigned: true }),
    overridenById: bigint("overriden_by_id", {
      mode: "number",
      unsigned: true,
    }),
    qcDatetime: datetime("qc_datetime", { mode: "string" }),
    overrideDatetime: datetime("override_datetime", { mode: "string" }),
    collectionStatus: bigint("collection_status", {
      mode: "number",
      unsigned: true,
    }),
    trackStatus: bigint("track_status", { mode: "number", unsigned: true }),
    isDispatched: int("is_dispatched"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_id",
      }),
    };
  },
);

export const oimsTransactionEntryCustomerAddressList = mysqlTable(
  "oims_transaction_entry_customer_address_list",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    accountType: bigint("account_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    accountId: bigint("account_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    addressLine1: longtext("address_line_1").notNull(),
    addressLine2: longtext("address_line_2"),
    addressType: bigint("address_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    addressLabel: bigint("address_label", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    stateId: bigint("state_id", { mode: "number", unsigned: true }).notNull(),
    cityId: bigint("city_id", { mode: "number", unsigned: true }).notNull(),
    barangayId: bigint("barangay_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    countryId: bigint("country_id", { mode: "number", unsigned: true }),
    postalId: bigint("postal_id", { mode: "number", unsigned: true }).notNull(),
    isPrimary: tinyint("is_primary").notNull(),
    contactPersonReference: varchar("contact_person_reference", {
      length: 255,
    }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryCustomerAddressListId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_customer_address_list_id",
      }),
    };
  },
);

export const oimsTransactionEntryCustomerContactPerson = mysqlTable(
  "oims_transaction_entry_customer_contact_person",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    accountId: bigint("account_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    position: varchar("position", { length: 255 }).notNull(),
    isPrimary: tinyint("is_primary").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryCustomerContactPersonId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_customer_contact_person_id",
      }),
    };
  },
);

export const oimsTransactionEntryCustomerInfo = mysqlTable(
  "oims_transaction_entry_customer_info",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    accountType: bigint("account_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    accountNo: varchar("account_no", { length: 255 }).notNull(),
    fullname: varchar("fullname", { length: 255 }).notNull(),
    companyName: varchar("company_name", { length: 255 }),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryCustomerInfoId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_customer_info_id",
      }),
    };
  },
);

export const oimsTransactionEntryCustomerMobileList = mysqlTable(
  "oims_transaction_entry_customer_mobile_list",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    accountId: bigint("account_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    accountType: int("account_type").notNull(),
    mobile: varchar("mobile", { length: 255 }).notNull(),
    isPrimary: tinyint("is_primary").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryCustomerMobileListId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_customer_mobile_list_id",
      }),
    };
  },
);

export const oimsTransactionEntryDiscountLog = mysqlTable(
  "oims_transaction_entry_discount_log",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillId: bigint("waybill_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    discountId: bigint("discount_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    discountName: varchar("discount_name", { length: 255 }).notNull(),
    discountPrice: double("discount_price", {
      precision: 8,
      scale: 2,
    }).notNull(),
    transactionDate: datetime("transaction_date", { mode: "string" }).notNull(),
    promoCode: varchar("promo_code", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryDiscountLogId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_discount_log_id",
      }),
    };
  },
);

export const oimsTransactionEntryForm2307 = mysqlTable(
  "oims_transaction_entry_form_2307",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillId: bigint("waybill_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryForm2307Id: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_form_2307_id",
      }),
    };
  },
);

export const oimsTransactionEntryItemBox = mysqlTable(
  "oims_transaction_entry_item_box",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillId: varchar("waybill_id", { length: 255 }).notNull(),
    qty: bigint("qty", { mode: "number", unsigned: true }).notNull(),
    boxSize: int("box_size").notNull(),
    weight: int("weight").notNull(),
    amount: double("amount", { precision: 8, scale: 2 }).notNull(),
    rateIdApplied: int("rate_id_applied").notNull(),
    cargotype: int("cargotype").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryItemBoxId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_item_box_id",
      }),
    };
  },
);

export const oimsTransactionEntryItemCharges = mysqlTable(
  "oims_transaction_entry_item_charges",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillId: bigint("waybill_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    weightCharge: double("weight_charge", { precision: 8, scale: 2 }).notNull(),
    awbFee: double("awb_fee", { precision: 8, scale: 2 }).notNull(),
    declaredValue: double("declared_value", {
      precision: 8,
      scale: 2,
    }).notNull(),
    valuation: double("valuation", { precision: 8, scale: 2 }).notNull(),
    codCharge: double("cod_charge", { precision: 8, scale: 2 }),
    insurance: double("insurance", { precision: 8, scale: 2 }),
    handlingFee: double("handling_fee", { precision: 8, scale: 2 }),
    docFee: double("doc_fee", { precision: 8, scale: 2 }),
    isOthersFee: tinyint("is_others_fee"),
    opaFee: double("opa_fee", { precision: 8, scale: 2 }),
    odaFee: double("oda_fee", { precision: 8, scale: 2 }),
    cratingFee: double("crating_fee", { precision: 8, scale: 2 }),
    equipmentRental: double("equipment_rental", { precision: 8, scale: 2 }),
    lashing: double("lashing", { precision: 8, scale: 2 }),
    manpower: double("manpower", { precision: 8, scale: 2 }),
    dangerousGoodsFee: double("dangerous_goods_fee", {
      precision: 8,
      scale: 2,
    }),
    trucking: double("trucking", { precision: 8, scale: 2 }),
    perishableFee: double("perishable_fee", { precision: 8, scale: 2 }),
    packagingFee: double("packaging_fee", { precision: 8, scale: 2 }),
    subtotal: double("subtotal", { precision: 8, scale: 2 }),
    rateDiscount: double("rate_discount", { precision: 8, scale: 2 }),
    promoCode: varchar("promo_code", { length: 255 }),
    promoDiscount: double("promo_discount", { precision: 8, scale: 2 }),
    evat: double("evat", { precision: 8, scale: 2 }),
    grandTotal: double("grand_total", { precision: 8, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryItemChargesId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_item_charges_id",
      }),
    };
  },
);

export const oimsTransactionEntryItemDetails = mysqlTable(
  "oims_transaction_entry_item_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillId: varchar("waybill_id", { length: 255 }).notNull(),
    qty: double("qty", { precision: 8, scale: 2 }).notNull(),
    weight: double("weight", { precision: 8, scale: 2 }).notNull(),
    length: double("length", { precision: 8, scale: 2 }).notNull(),
    width: double("width", { precision: 8, scale: 2 }).notNull(),
    height: double("height", { precision: 8, scale: 2 }).notNull(),
    unitOfMeasurementId: bigint("unit_of_measurement_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    measurementTypeId: bigint("measurement_type_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    typeOfPackagingId: bigint("type_of_packaging_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    isForCrating: tinyint("is_for_crating").notNull(),
    cratingStatus: int("crating_status").notNull(),
    cratingTypeId: bigint("crating_type_id", {
      mode: "number",
      unsigned: true,
    }),
    cwt: double("cwt", { precision: 8, scale: 2 }),
    cbm: double("cbm", { precision: 8, scale: 2 }),
    container: double("container", { precision: 8, scale: 2 }),
    rateIdApplied: int("rate_id_applied"),
    cargotype: int("cargotype").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryItemDetailsId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_item_details_id",
      }),
    };
  },
);

export const oimsTransactionEntryItemDetailsSummary = mysqlTable(
  "oims_transaction_entry_item_details_summary",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillId: varchar("waybill_id", { length: 255 }).notNull(),
    totalQty: double("total_qty", { precision: 8, scale: 2 }).notNull(),
    totalWeight: double("total_weight", { precision: 8, scale: 2 }).notNull(),
    totalDimension: double("total_dimension", {
      precision: 8,
      scale: 2,
    }).notNull(),
    totalContainer: double("total_container", { precision: 8, scale: 2 }),
    totalCbm: double("total_cbm", { precision: 8, scale: 2 }),
    totalCwt: double("total_cwt", { precision: 8, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryItemDetailsSummaryId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_item_details_summary_id",
      }),
    };
  },
);

export const oimsTransactionEntryItemPouch = mysqlTable(
  "oims_transaction_entry_item_pouch",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillId: varchar("waybill_id", { length: 255 }).notNull(),
    qty: bigint("qty", { mode: "number", unsigned: true }).notNull(),
    pouchSize: int("pouch_size").notNull(),
    amount: double("amount", { precision: 8, scale: 2 }).notNull(),
    rateIdApplied: int("rate_id_applied").notNull(),
    cargotype: int("cargotype").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryItemPouchId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_item_pouch_id",
      }),
    };
  },
);

export const oimsTransactionEntryItemTypeReference = mysqlTable(
  "oims_transaction_entry_item_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    transportMode: bigint("transport_mode", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryItemTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_item_type_reference_id",
      }),
    };
  },
);

export const oimsTransactionEntryPaymentDetails = mysqlTable(
  "oims_transaction_entry_payment_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillId: varchar("waybill_id", { length: 255 }).notNull(),
    isSingleWaybill: tinyint("is_single_waybill").notNull(),
    isPartialPayment: tinyint("is_partial_payment").notNull(),
    partialPaymentStatus: int("partial_payment_status").notNull(),
    paymentType: bigint("payment_type", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    amount: double("amount", { precision: 8, scale: 2 }).notNull(),
    orAr: varchar("or/ar", { length: 255 }),
    payor: int("payor"),
    payorMobileNo: int("payor_mobile_no"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryPaymentDetailsId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_payment_details_id",
      }),
    };
  },
);

export const oimsTransactionEntryPaymentDetailsPartial = mysqlTable(
  "oims_transaction_entry_payment_details_partial",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillId: bigint("waybill_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    paymentAmount: double("payment_amount", {
      precision: 8,
      scale: 2,
    }).notNull(),
    remainingBalance: double("remaining_balance", {
      precision: 8,
      scale: 2,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryPaymentDetailsPartialId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_payment_details_partial_id",
      }),
    };
  },
);

export const oimsTransactionEntryTypeGoods = mysqlTable(
  "oims_transaction_entry_type_goods",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionEntryTypeGoodsId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_entry_type_goods_id",
      }),
    };
  },
);

export const oimsTransactionTypeReference = mysqlTable(
  "oims_transaction_type_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransactionTypeReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_transaction_type_reference_id",
      }),
    };
  },
);

export const oimsTransportReference = mysqlTable(
  "oims_transport_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTransportReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_transport_reference_id",
      }),
    };
  },
);

export const oimsTypeOfPackagingReference = mysqlTable(
  "oims_type_of_packaging_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsTypeOfPackagingReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_type_of_packaging_reference_id",
      }),
    };
  },
);

export const oimsVehicle = mysqlTable(
  "oims_vehicle",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    plateNo: varchar("plate_no", { length: 255 }).notNull(),
    vehicleType: bigint("vehicle_type", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsVehicleType.id),
    branchId: bigint("branch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsBranchReference.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsVehicleId: primaryKey({
        columns: [table.id],
        name: "oims_vehicle_id",
      }),
    };
  },
);

export const oimsVehicleType = mysqlTable(
  "oims_vehicle_type",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsVehicleTypeId: primaryKey({
        columns: [table.id],
        name: "oims_vehicle_type_id",
      }),
    };
  },
);

export const oimsWaybillRegistry = mysqlTable(
  "oims_waybill_registry",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillStart: varchar("waybill_start", { length: 255 }).notNull(),
    waybillEnd: varchar("waybill_end", { length: 255 }).notNull(),
    poReference: varchar("po_reference", { length: 255 }).notNull(),
    branchId: bigint("branch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsBranchReference.id),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    issuedTo: bigint("issued_to", { mode: "number", unsigned: true }),
    issuedToEmpId: bigint("issued_to_emp_id", {
      mode: "number",
      unsigned: true,
    }).references(() => userDetails.id),
    issuedToCustomerId: bigint("issued_to_customer_id", {
      mode: "number",
      unsigned: true,
    }).references(() => crmCustomerInformation.id),
    issuedToAgentId: bigint("issued_to_agent_id", {
      mode: "number",
      unsigned: true,
    }).references(() => oimsAgent.id),
    issuedToOm: bigint("issued_to_om", {
      mode: "number",
      unsigned: true,
    }).references(() => userDetails.id),
    issuedToFls: bigint("issued_to_fls", {
      mode: "number",
      unsigned: true,
    }).references(() => userDetails.id),
    issuanceStatus: bigint("issuance_status", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    padNo: bigint("pad_no", { mode: "number", unsigned: true }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    closedDate: date("closed_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    issuanceDate: date("issuance_date", { mode: "string" }),
    createdBy: bigint("created_by", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsWaybillRegistryId: primaryKey({
        columns: [table.id],
        name: "oims_waybill_registry_id",
      }),
    };
  },
);

export const oimsWaybillRegistryDetails = mysqlTable(
  "oims_waybill_registry_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    waybillRegistryId: bigint("waybill_registry_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => oimsWaybillRegistry.id),
    waybill: varchar("waybill", { length: 255 }).notNull(),
    branchId: bigint("branch_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => oimsBranchReference.id),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    padNo: bigint("pad_no", { mode: "number", unsigned: true }).notNull(),
    skippedStatus: bigint("skipped_status", { mode: "number", unsigned: true }),
    skippedStatus2: bigint("skipped_status2", {
      mode: "number",
      unsigned: true,
    }),
    skippedStatus3: bigint("skipped_status3", {
      mode: "number",
      unsigned: true,
    }),
    issueToFlsIdentify: bigint("issue_to_fls_identify", {
      mode: "number",
      unsigned: true,
    }),
    issueToOmIdentify: bigint("issue_to_om_identify", {
      mode: "number",
      unsigned: true,
    }),
    issueToCheckerIdentify: bigint("issue_to_checker_identify", {
      mode: "number",
      unsigned: true,
    }),
    dateFlsIssued: datetime("date_fls_issued", { mode: "string" }),
    dateOmIssued: datetime("date_om_issued", { mode: "string" }),
    dateCheckerIssued: datetime("date_checker_issued", { mode: "string" }),
    dateCustomerIssued: datetime("date_customer_issued", { mode: "string" }),
    dateAgentIssued: datetime("date_agent_issued", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsWaybillRegistryDetailsId: primaryKey({
        columns: [table.id],
        name: "oims_waybill_registry_details_id",
      }),
    };
  },
);

export const oimsZipcodeReference = mysqlTable(
  "oims_zipcode_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: bigint("status", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      oimsZipcodeReferenceId: primaryKey({
        columns: [table.id],
        name: "oims_zipcode_reference_id",
      }),
    };
  },
);

export const passwordResets = mysqlTable(
  "password_resets",
  {
    email: varchar("email", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
  },
  (table) => {
    return {
      emailIdx: index("idx").on(table.email),
    };
  },
);

export const personalAccessTokens = mysqlTable(
  "personal_access_tokens",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    tokenableType: varchar("tokenable_type", { length: 255 }).notNull(),
    tokenableId: bigint("tokenable_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    token: varchar("token", { length: 64 }).notNull(),
    abilities: text("abilities"),
    lastUsedAt: timestamp("last_used_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      tokenableTypeTokenableIdIdx: index("idx").on(
        table.tokenableType,
        table.tokenableId,
      ),
      personalAccessTokensId: primaryKey({
        columns: [table.id],
        name: "personal_access_tokens_id",
      }),
      personalAccessTokensTokenUnique: unique(
        "personal_access_tokens_token_unique",
      ).on(table.token),
    };
  },
);

export const region = mysqlTable(
  "region",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    islandGroupId: bigint("island_group_id", {
      mode: "number",
      unsigned: true,
    }).references(() => islandGroup.id),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      islandGroupIdForeign: index("region_island_group_id_foreign").on(
        table.islandGroupId,
      ),
      regionId: primaryKey({ columns: [table.id], name: "region_id" }),
    };
  },
);

export const rolesChildAccessReference = mysqlTable(
  "roles_child_access_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    rolesParentAccessId: bigint("roles_parent_access_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: bigint("is_visible", { mode: "number", unsigned: true })
      .default(1)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      rolesParentAccessIdForeign: index(
        "roles_child_access_reference_roles_parent_access_id_foreign",
      ).on(table.rolesParentAccessId),
      rolesChildAccessReferenceId: primaryKey({
        columns: [table.id],
        name: "roles_child_access_reference_id",
      }),
    };
  },
);

export const rolesParentAccessReference = mysqlTable(
  "roles_parent_access_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    divisionId: bigint("division_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    display: varchar("display", { length: 255 }).notNull(),
    isVisible: bigint("is_visible", { mode: "number", unsigned: true })
      .default(1)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      divisionIdForeign: index(
        "roles_parent_access_reference_division_id_foreign",
      ).on(table.divisionId),
      rolesParentAccessReferenceId: primaryKey({
        columns: [table.id],
        name: "roles_parent_access_reference_id",
      }),
    };
  },
);

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    payload: text("payload").notNull(),
    lastActivity: int("last_activity").notNull(),
  },
  (table) => {
    return {
      lastActivityIdx: index("idx").on(table.lastActivity),
      userIdIdx: index("idx").on(table.userId),
      sessionsId: primaryKey({ columns: [table.id], name: "sessions_id" }),
    };
  },
);

export const state = mysqlTable(
  "state",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    regionId: bigint("region_id", {
      mode: "number",
      unsigned: true,
    }).references(() => region.id),
    islandGroupId: bigint("island_group_id", {
      mode: "number",
      unsigned: true,
    }).references(() => islandGroup.id),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    psgcCode: int("psgcCode"),
    regCode: int("regCode"),
    provCode: int("provCode"),
    status: int("status").notNull(),
  },
  (table) => {
    return {
      islandGroupIdForeign: index("state_island_group_id_foreign").on(
        table.islandGroupId,
      ),
      regionIdForeign: index("state_region_id_foreign").on(table.regionId),
      stateId: primaryKey({ columns: [table.id], name: "state_id" }),
    };
  },
);

export const suffixReference = mysqlTable(
  "suffix_reference",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    code: varchar("code", { length: 255 }),
    display: varchar("display", { length: 255 }),
    isVisible: bigint("is_visible", { mode: "number", unsigned: true })
      .default(1)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      suffixReferenceId: primaryKey({
        columns: [table.id],
        name: "suffix_reference_id",
      }),
    };
  },
);

export const ticketCategory = mysqlTable(
  "ticket_category",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    divisionId: int("division_id").notNull(),
    createdBy: int("created_by").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      ticketCategoryId: primaryKey({
        columns: [table.id],
        name: "ticket_category_id",
      }),
    };
  },
);

export const ticketSubcategory = mysqlTable(
  "ticket_subcategory",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    divisionId: int("division_id").notNull(),
    departmentId: bigint("department_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    categoryId: int("category_id").notNull(),
    sla: int("sla"),
    severity: int("severity"),
    createdBy: int("created_by").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      ticketSubcategoryId: primaryKey({
        columns: [table.id],
        name: "ticket_subcategory_id",
      }),
    };
  },
);

export const ticketTaskHolder = mysqlTable(
  "ticket_task_holder",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    categoryId: bigint("category_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => ticketCategory.id),
    subcategoryId: bigint("subcategory_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => ticketSubcategory.id),
    divisionId: bigint("division_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    departmentId: bigint("department_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      ticketTaskHolderId: primaryKey({
        columns: [table.id],
        name: "ticket_task_holder_id",
      }),
    };
  },
);

export const ticketTicketingSystem = mysqlTable(
  "ticket_ticketing_system",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    ticketReferenceNo: varchar("ticket_reference_no", {
      length: 255,
    }).notNull(),
    divisionId: bigint("division_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => division.id),
    subject: longtext("subject").notNull(),
    categoryId: bigint("category_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => ticketCategory.id),
    subcategoryId: bigint("subcategory_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => ticketSubcategory.id),
    message: longtext("message"),
    taskHolder: int("task_holder").notNull(),
    concernReference: varchar("concern_reference", { length: 255 }),
    concernReferenceUrl: varchar("concern_reference_url", { length: 255 }),
    requestedBy: int("requested_by").notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    actualStartDate: date("actual_start_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    actualEndDate: date("actual_end_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    targetStartDate: date("target_start_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    targetEndDate: date("target_end_date", { mode: "string" }),
    taskHolderStatus: int("task_holder_status"),
    requesterStatus: int("requester_status"),
    finalStatus: int("final_status").notNull(),
    remarks: varchar("remarks", { length: 255 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    assignmentDate: date("assignment_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    taskHolderStatusDate: date("task_holder_status_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    requesterStatusDate: date("requester_status_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    finalStatusDate: date("final_status_date", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      ticketTicketingSystemId: primaryKey({
        columns: [table.id],
        name: "ticket_ticketing_system_id",
      }),
    };
  },
);

export const ticketingTicketAttachments = mysqlTable(
  "ticketing_ticket_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    ticketId: bigint("ticket_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => ticketTicketingSystem.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      ticketingTicketAttachmentsId: primaryKey({
        columns: [table.id],
        name: "ticketing_ticket_attachments_id",
      }),
    };
  },
);

export const trainingAndRefreshers = mysqlTable(
  "training_and_refreshers",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    videoRef: varchar("video_ref", { length: 255 }).notNull(),
    isTagAllPosition: tinyint("is_tag_all_position").default(0).notNull(),
    taggedDivision: int("tagged_division"),
    position: int("position"),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      trainingAndRefreshersId: primaryKey({
        columns: [table.id],
        name: "training_and_refreshers_id",
      }),
    };
  },
);

export const trainingAndRefreshersAttachment = mysqlTable(
  "training_and_refreshers_attachment",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    videoRef: varchar("video_ref", { length: 255 }).notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    originalFilename: varchar("original_filename", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      trainAndRefIdForeign: index(
        "training_and_refreshers_attachment_train_and_ref_id_foreign",
      ).on(table.videoRef),
      trainingAndRefreshersAttachmentId: primaryKey({
        columns: [table.id],
        name: "training_and_refreshers_attachment_id",
      }),
    };
  },
);

export const trainingFixedAssets = mysqlTable(
  "training_fixed_assets",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    furnituresFixtures: varchar("furnitures_fixtures", {
      length: 255,
    }).notNull(),
    description: longtext("description").notNull(),
    quantity: int("quantity").notNull(),
    assetCode: varchar("asset_code", { length: 255 }).notNull(),
    brand: varchar("brand", { length: 255 }).notNull(),
    locationBranch: bigint("location_branch", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => trainingFixedAssetsLocbranch.id),
    areaAssign: bigint("area_assign", { mode: "number", unsigned: true })
      .notNull()
      .references(() => trainingFixedAssetsAreaAssign.id),
    employeeName: int("employee_name").notNull(),
    status: int("status").notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      trainingFixedAssetsId: primaryKey({
        columns: [table.id],
        name: "training_fixed_assets_id",
      }),
    };
  },
);

export const trainingFixedAssetsAreaAssign = mysqlTable(
  "training_fixed_assets_area_assign",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      trainingFixedAssetsAreaAssignId: primaryKey({
        columns: [table.id],
        name: "training_fixed_assets_area_assign_id",
      }),
    };
  },
);

export const trainingFixedAssetsAttachments = mysqlTable(
  "training_fixed_assets_attachments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    fixedAssetId: bigint("fixed_asset_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => trainingFixedAssets.id),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      trainingFixedAssetsAttachmentsId: primaryKey({
        columns: [table.id],
        name: "training_fixed_assets_attachments_id",
      }),
    };
  },
);

export const trainingFixedAssetsLocbranch = mysqlTable(
  "training_fixed_assets_locbranch",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      trainingFixedAssetsLocbranchId: primaryKey({
        columns: [table.id],
        name: "training_fixed_assets_locbranch_id",
      }),
    };
  },
);

export const userDetails = mysqlTable(
  "user_details",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    agencyId: bigint("agency_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimAgencies.id),
    branchId: bigint("branch_id", {
      mode: "number",
      unsigned: true,
    }).references(() => branchReference.id),
    scheduleId: bigint("schedule_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimWorkSchedule.id),
    employeeNumber: varchar("employee_number", { length: 255 }),
    employeeCode: varchar("employee_code", { length: 255 }),
    bankAccountNumber: varchar("bank_account_number", { length: 255 }),
    erfReferenceNo: varchar("erf_reference_no", { length: 255 }),
    salaryGradeId: int("salary_grade_id"),
    firstName: varchar("first_name", { length: 255 }),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    positionId: bigint("position_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimPositions.id),
    jobLevelId: bigint("job_level_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimJobLevels.id),
    departmentId: bigint("department_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimDepartments.id),
    divisionId: bigint("division_id", {
      mode: "number",
      unsigned: true,
    }).references(() => division.id),
    employmentCategoryId: bigint("employment_category_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimEmploymentCategory.id),
    employmentStatusId: bigint("employment_status_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimEmploymentStatus.id),
    genderId: bigint("gender_id", {
      mode: "number",
      unsigned: true,
    }).references(() => hrimGender.id),
    suffixId: bigint("suffix_id", {
      mode: "number",
      unsigned: true,
    }).references(() => suffixReference.id),
    companyEmail: varchar("company_email", { length: 255 }).notNull(),
    age: varchar("age", { length: 255 }),
    birthDate: varchar("birth_date", { length: 255 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    hiredDate: date("hired_date", { mode: "string" }),
    personalMobileNumber: varchar("personal_mobile_number", { length: 255 }),
    personalTelephoneNumber: varchar("personal_telephone_number", {
      length: 255,
    }),
    personalEmail: varchar("personal_email", { length: 255 }),
    companyMobileNumber: varchar("company_mobile_number", { length: 255 }),
    companyTelephoneNumber: varchar("company_telephone_number", {
      length: 255,
    }),
    currentCountryCode: varchar("current_country_code", { length: 255 }),
    currentRegionCode: varchar("current_region_code", { length: 255 }),
    currentProvinceCode: varchar("current_province_code", { length: 255 }),
    currentCityCode: varchar("current_city_code", { length: 255 }),
    currentBarangayCode: varchar("current_barangay_code", { length: 255 }),
    currentStreet: varchar("current_street", { length: 255 }),
    currentAddress: longtext("current_address"),
    permanentCountryCode: varchar("permanent_country_code", { length: 255 }),
    permanentRegionCode: varchar("permanent_region_code", { length: 255 }),
    permanentProvinceCode: varchar("permanent_province_code", { length: 255 }),
    permanentCityCode: varchar("permanent_city_code", { length: 255 }),
    permanentBarangayCode: varchar("permanent_barangay_code", { length: 255 }),
    permanentStreet: varchar("permanent_street", { length: 255 }),
    permanentAddress: longtext("permanent_address"),
    agencyContactPerson: varchar("agency_contact_person", { length: 255 }),
    agencyContactNo: varchar("agency_contact_no", { length: 255 }),
    agencyType: int("agency_type"),
    agencyPosition: varchar("agency_position", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      userDetailsId: primaryKey({
        columns: [table.id],
        name: "user_details_id",
      }),
      userDetailsEmailUnique: unique("user_details_email_unique").on(
        table.companyEmail,
      ),
    };
  },
);

export const userSignature = mysqlTable(
  "user_signature",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    userId: int("user_id").notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    extension: varchar("extension", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      userSignatureId: primaryKey({
        columns: [table.id],
        name: "user_signature_id",
      }),
    };
  },
);

export const users = mysqlTable(
  "users",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    roleId: bigint("role_id", { mode: "number", unsigned: true }).notNull(),
    divisionId: bigint("division_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    levelId: bigint("level_id", { mode: "number", unsigned: true }).notNull(),
    statusId: bigint("status_id", { mode: "number", unsigned: true })
      .default(1)
      .notNull(),
    photoPath: varchar("photo_path", { length: 255 }),
    photoName: varchar("photo_name", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { mode: "string" }),
    emailVerificationCode: varchar("email_verification_code", { length: 255 }),
    password: varchar("password", { length: 255 }).notNull(),
    attempt: int("attempt").default(0).notNull(),
    otp: int("otp"),
    twoFactorSecret: text("two_factor_secret"),
    twoFactorRecoveryCodes: text("two_factor_recovery_codes"),
    rememberToken: varchar("remember_token", { length: 100 }),
    currentTeamId: bigint("current_team_id", {
      mode: "number",
      unsigned: true,
    }),
    profilePhotoPath: varchar("profile_photo_path", { length: 2048 }),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    gcalendarAccessToken: text("gcalendar_access_token"),
    gcalendarRefreshToken: text("gcalendar_refresh_token"),
    gcalendarUserAccountInfo: text("gcalendar_user_account_info"),
  },
  (table) => {
    return {
      divisionIdForeign: index("users_division_id_foreign").on(
        table.divisionId,
      ),
      levelIdForeign: index("users_level_id_foreign").on(table.levelId),
      roleIdForeign: index("users_role_id_foreign").on(table.roleId),
      statusIdForeign: index("users_status_id_foreign").on(table.statusId),
      usersId: primaryKey({ columns: [table.id], name: "users_id" }),
      usersEmailUnique: unique("users_email_unique").on(table.email),
    };
  },
);

export const vipPortalUserRole = mysqlTable(
  "vip_portal_user_role",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      vipPortalUserRoleId: primaryKey({
        columns: [table.id],
        name: "vip_portal_user_role_id",
      }),
    };
  },
);

export const vipPortalUsers = mysqlTable(
  "vip_portal_users",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .autoincrement()
      .notNull(),
    roleId: bigint("role_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => divisionRolesReference.id),
    vipRoleId: bigint("vip_role_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => vipPortalUserRole.id),
    isSubAccount: bigint("is_sub_account", { mode: "number", unsigned: true }),
    levelId: bigint("level_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => levelReference.id),
    statusId: bigint("status_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => accountStatusReference.id),
    customerId: bigint("customer_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => crmCustomerInformation.id),
    photoPath: varchar("photo_path", { length: 255 }).notNull(),
    photoName: varchar("photo_name", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    position: varchar("position", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => {
    return {
      vipPortalUsersId: primaryKey({
        columns: [table.id],
        name: "vip_portal_users_id",
      }),
    };
  },
);
