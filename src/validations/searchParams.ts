import { months } from "@/lib/utils";
import { z } from "zod";

export const budgetSourceSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const opexCategorySearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const chartOfAccountsSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const subAccountsSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const reasonForRejectionSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const purposeSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const unitSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const industrySearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const itemCategorySearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const serviceCategorySearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const itemDescriptionSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const serviceDescriptionSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const serviceRequisitionSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const serviceRequisitionCreateSearchParams = z.object({
  categoryId: z.coerce.number().optional(),
});

export const serviceRequisitionViewSearchParams = z.object({
  print: z.coerce.boolean().optional().default(false),
  budgetDetails: z.coerce.boolean().optional().default(true),
  showButtons: z.string().optional(),
});

export const purchaseRequisitionViewSearchParams = z.object({
  print: z.coerce.boolean().optional().default(false),
  budgetDetails: z.coerce.boolean().optional().default(true),
  showButtons: z.string().optional(),
});

export const purchaseRequisitionSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const recurringRequisitionSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const recurringRequisitionCreateSearchParams = z.object({
  apCategory: z.string().optional(),
  rentalType: z.coerce.number().optional().default(1),
});

export const canvasRequestSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const manpowerSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const supplierSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const supplierCreateSearchParams = z.object({
  regionId: z.coerce.number().optional(),
  cityId: z.coerce.number().optional(),
});

export const loaSearchParams = z.object({
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const loaUpdateSearchParams = z.object({
  subModuleId: z.coerce.number(),
  divisionId: z.coerce.number(),
  selectedDivision: z.coerce.number().optional(),
});

export const budgetPlanSearchParams = z.object({
  year: z.coerce.number().optional(),
  divisionId: z.coerce.number().optional(),
});

export const budgetPlanTransferSearchParams = z.object({
  year: z.coerce.number().optional(),
  coaID: z.coerce.number().optional(),
  from: z.enum(months).optional(),
  to: z.enum(months).optional(),
});

export const snpRequestSearchParams = z.object({
  name: z.string().optional(),
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const jobOrderViewSearchParams = z.object({
  print: z.coerce.boolean().default(false),
});

export const rfpSearchParams = z.object({
  reset: z.coerce.boolean().optional().default(false),
  status: z.coerce.number().optional().default(0),
  page: z.coerce.number().optional(),
  dateRequestedFrom: z.coerce.date().optional(),
  dateRequestedTo: z.coerce.date().optional(),
  dateNeededFrom: z.coerce.date().optional(),
  dateNeededTo: z.coerce.date().optional(),
  payeeId: z.coerce.number().optional(),
  subPayeeId: z.coerce.number().optional(),
});

export const rfpCreateSearchParams = z.object({
  vat: z.string().optional(),
  ewt: z.coerce.number().optional(),
});

export const checkVoucherSearchParams = z.object({
  status: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  checkNumber: z.string().optional(),
  rfpReferenceNo: z.string().optional(),
  dateRelease: z.coerce.date().optional(),
});

export const accessSearchParams = z.object({
  page: z.coerce.number().optional(),
  path: z.string().optional(),
  status: z.coerce.number().optional(),
});
