import { fimsTable } from "@/db/schema/_table";
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  float,
  index,
  int,
  longtext,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const bank = fimsTable("bank", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

/**
 * 1 = Service Requisition
 * 2 = Purchase Requisition
 * 3 = CR - Service Req
 * 4 = CR - Purchase Req
 * 5 = Recurring - Service Req
 */
export const requisitionType = fimsTable("requisition_type", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

// Active is 1, Inactive is 2
export const budgetSource = fimsTable("budget_source", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: int("status").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const opexCategory = fimsTable("opex_category", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  status: int("status").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const chartOfAccounts = fimsTable("chart_of_accounts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  accountCode: varchar("account_code", { length: 255 }).notNull(),
  status: int("status").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const subAccounts = fimsTable("sub_accounts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  accountCode: varchar("account_code", { length: 255 }).notNull(),
  status: int("status").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const reasonForRejection = fimsTable("reason_for_rejection", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: int("status").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const purpose = fimsTable("purpose", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: int("status").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const unit = fimsTable("unit", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: int("status").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const industry = fimsTable("industry", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: int("status").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const itemCategory = fimsTable(
  "item_category",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    isRecurring: boolean("is_recurring").default(false).notNull(),
    budgetSourceId: bigint("budget_source_id", { mode: "number" }).notNull(),
    opexCategoryId: bigint("opex_category_id", { mode: "number" }).notNull(),
    chartOfAccountsId: bigint("chart_of_accounts_id", {
      mode: "number",
    }).notNull(),
    subAccountsId: bigint("sub_accounts_id", { mode: "number" }).notNull(),
    status: int("status").default(1).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      opexCategoryIdx: index("opex_category_idx").on(table.opexCategoryId),
      budgetSourceIdx: index("budget_source_idx").on(table.budgetSourceId),
      chartOfAccountsIdx: index("chart_of_accounts_idx").on(
        table.chartOfAccountsId,
      ),
      subAccountsIdx: index("sub_accounts_idx").on(table.chartOfAccountsId),
      uniqueCombination: unique("unique_combination").on(
        table.budgetSourceId,
        table.opexCategoryId,
        table.chartOfAccountsId,
        table.subAccountsId,
      ),
    };
  },
);

export const serviceCategory = fimsTable(
  "service_category",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    isRecurring: boolean("is_recurring").default(false).notNull(),
    budgetSourceId: bigint("budget_source_id", { mode: "number" }).notNull(),
    opexCategoryId: bigint("opex_category_id", { mode: "number" }).notNull(),
    chartOfAccountsId: bigint("chart_of_accounts_id", {
      mode: "number",
    }).notNull(),
    subAccountsId: bigint("sub_accounts_id", { mode: "number" }).notNull(),
    status: int("status").default(1).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      nameIndex: index("name_index").on(table.name),
      opexCategoryIdx: index("opex_category_idx").on(table.opexCategoryId),
      budgetSourceIdx: index("budget_source_idx").on(table.budgetSourceId),
      chartOfAccountsIdx: index("chart_of_accounts_idx").on(
        table.chartOfAccountsId,
      ),
      subAccountsIdx: index("sub_accounts_idx").on(table.chartOfAccountsId),
      uniqueCombination: unique("unique_combination").on(
        table.budgetSourceId,
        table.opexCategoryId,
        table.chartOfAccountsId,
        table.subAccountsId,
      ),
    };
  },
);

export const itemDescription = fimsTable(
  "item_description",
  {
    id: serial("id").primaryKey(),
    itemCategoryId: bigint("item_category_id", { mode: "number" }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    price: float("price").notNull(),
    status: int("status").default(1).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    itemCategory: index("item_category_idx").on(table.itemCategoryId),
  }),
);

export const serviceDescription = fimsTable(
  "service_description",
  {
    id: serial("id").primaryKey(),
    serviceCategoryId: bigint("service_category_id", {
      mode: "number",
    }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    price: float("price").notNull(),
    status: int("status").default(1).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      serviceCategoryIdx: index("service_category_idx").on(
        table.serviceCategoryId,
      ),
    };
  },
);

export const manpower = fimsTable("manpower", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  emailAddress: varchar("email_address", { length: 255 }).notNull(),
  mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
  telephoneNumber: varchar("tel_number", { length: 255 }),
  agency: varchar("agency", { length: 255 }).notNull(),
  tin: varchar("tin", { length: 255 }).notNull(),
  status: int("status").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const supplier = fimsTable(
  "supplier",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    tradeName: varchar("trade_name", { length: 255 }).notNull(),
    tin: varchar("tin", { length: 255 }).notNull(),
    industryId: bigint("industry_id", { mode: "number" }).notNull(),
    barangayId: bigint("barangay_id", { mode: "number" }).notNull(),
    cityId: bigint("city_id", { mode: "number" }).notNull(),
    regionId: bigint("region_id", { mode: "number" }).notNull(),
    postalCode: varchar("postal_code", { length: 255 }).notNull(),
    address: longtext("address").notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    emailAddress: varchar("email_address", { length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
    tel_number: varchar("tel_number", { length: 255 }),
    payeeName: varchar("payee_name", { length: 255 }).notNull(),
    payeeAccountNumber: varchar("payee_account_number", {
      length: 255,
    }).notNull(),
    bankAccountNumber: varchar("bank_account_number", {
      length: 255,
    }).notNull(),
    bankAccountName: varchar("bank_account_name", { length: 255 }).notNull(),
    bankId: bigint("bank_id", { mode: "number" }).notNull(),
    status: int("status").default(1).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      bankIdx: index("bank_idx").on(table.bankId),
      regionIdx: index("region_idx").on(table.regionId),
      cityIdx: index("city_idx").on(table.cityId),
      barangayIdx: index("barangay_idx").on(table.barangayId),
      industryIdx: index("industry_idx").on(table.industryId),
    };
  },
);

export const priorityLevel = fimsTable(
  "priority_level",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    description: longtext("description"),
    daysMax: int("days_max").notNull(),
    daysMin: int("days_min").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      maxIdx: index("days_max_idx").on(table.daysMax),
      minIdx: index("days_min_idx").on(table.daysMin),
    };
  },
);

export const paymentOption = fimsTable("payment_option", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const methodOfDelivery = fimsTable("method_of_delivery", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const paymentMode = fimsTable("payment_mode", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const subModule = fimsTable("sub_module", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const loaManagement = fimsTable(
  "loa_management",
  {
    id: serial("id").primaryKey(),
    subModuleId: bigint("sub_module_id", {
      mode: "number",
    }).notNull(),
    divisionId: bigint("division_id", { mode: "number" }).notNull(),
    minAmount: float("min_amount").notNull(),
    maxAmount: float("max_amount").notNull(),
    level: int("level").notNull(),
    reviewer1Id: bigint("reviewer1_id", { mode: "number" }),
    reviewer2Id: bigint("reviewer2_id", { mode: "number" }),
    approver1Id: bigint("approver1_id", { mode: "number" }).notNull(),
    approver2Id: bigint("approver2_id", { mode: "number" }),
    approver3Id: bigint("approver3_id", { mode: "number" }),
    status: int("status").notNull().default(1),
    createdAt: timestamp("created_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
  },
  (table) => ({
    uniqueModuleByDivision: unique("unique_moduleByDivision").on(
      table.subModuleId,
      table.divisionId,
      table.level,
    ),
    subModuleIdx: index("sub_module_idx").on(table.subModuleId),
    divisionIdx: index("division_idx").on(table.divisionId),
    reviewer1Idx: index("reviewer1Idx").on(table.reviewer1Id),
    reviewer2Idx: index("reviewer2Idx").on(table.reviewer2Id),
    approver1Idx: index("approver1Idx").on(table.approver1Id),
    approver2Idx: index("approver2Idx").on(table.approver2Id),
    approver3Idx: index("approver3Idx").on(table.approver3Id),
  }),
);

export const transportMode = fimsTable("transport_mode", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const carrier = fimsTable(
  "carrier",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    transportModeId: bigint("transport_mode_id", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    transportModeIdx: index("transport_mode_idx").on(table.transportModeId),
  }),
);

export const utilityType = fimsTable("utility_type", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const serviceProvider = fimsTable("service_provider", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const hub = fimsTable("hub", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const leasor = fimsTable("leasor", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const subscription = fimsTable("subscription", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const provider = fimsTable("provider", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const wingVan = fimsTable("wing_van", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const trainings = fimsTable("trainings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  learningObjective: varchar("learning_objective", { length: 255 }).notNull(),
});

export const accessRights = fimsTable(
  "access_rights",
  {
    id: serial("id").primaryKey(),
    accessId: bigint("access_id", { mode: "number" }).notNull(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
    accessIdIndex: index("access_id_index").on(table.accessId),
  }),
);

export const access = fimsTable("access", {
  id: serial("id").primaryKey(),
  path: varchar("path", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const queueReference = fimsTable(
  "queue_reference",
  {
    id: serial("id").primaryKey(),
    prefix: varchar("prefix", { length: 255 }).notNull(),
    datePart: varchar("date_part", { length: 255 }).notNull(),
    number: int("number").default(1).notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    uniqueReference: unique("unique_reference").on(
      table.prefix,
      table.datePart,
    ),
  }),
);
