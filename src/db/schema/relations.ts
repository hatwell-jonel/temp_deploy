import { relations } from "drizzle-orm";
import {
  barangay,
  city,
  division,
  branchReference as location,
  region,
  users,
} from "./_pulled";
import {
  access,
  accessRights,
  airline,
  airlineAttachments,
  availment,
  bank,
  budgetSource,
  canvasPurchase,
  canvasPurchaseAttachments,
  canvasService,
  canvasServiceAttachments,
  canvassing,
  carrier,
  chartOfAccounts,
  checkVoucher,
  checkVoucherOrSiNumber,
  hub,
  industry,
  itemCategory,
  itemDescription,
  leasor,
  loaManagement,
  manpower,
  methodOfDelivery,
  opexCategory,
  order,
  paymentMode,
  paymentOption,
  priorityLevel,
  provider,
  purchase,
  purchaseAttachments,
  purchasing,
  purpose,
  reasonForRejection,
  recurring,
  rentals as rental,
  rentalsAttachments,
  request,
  requisition,
  requisitionType,
  rfp,
  rfpAttachments,
  rfpParticulars,
  serviceCategory,
  serviceDescription,
  serviceProvider,
  serviceRequisition,
  serviceRequisitionAttachments,
  subAccounts,
  subModule,
  subscription,
  subscriptionDetail,
  subscriptionsAttachments,
  supplier,
  transportMode,
  unit,
  utility,
  utilityAttachments,
  utilityType,
  yearlyBudget,
} from "./fims";

export const loaManagementRelations = relations(loaManagement, ({ one }) => ({
  division: one(division, {
    fields: [loaManagement.divisionId],
    references: [division.id],
  }),
  firstReviewer: one(users, {
    fields: [loaManagement.reviewer1Id],
    references: [users.id],
  }),
  secondReviewer: one(users, {
    fields: [loaManagement.reviewer2Id],
    references: [users.id],
  }),
  firstApprover: one(users, {
    fields: [loaManagement.approver1Id],
    references: [users.id],
  }),
  secondApprover: one(users, {
    fields: [loaManagement.approver2Id],
    references: [users.id],
  }),
  thirdApprover: one(users, {
    fields: [loaManagement.approver3Id],
    references: [users.id],
  }),
  subModule: one(subModule, {
    fields: [loaManagement.subModuleId],
    references: [subModule.id],
  }),
}));

export const requestRelations = relations(request, ({ one }) => ({
  priorityLevel: one(priorityLevel, {
    fields: [request.priorityLevelId],
    references: [priorityLevel.id],
  }),
  nextActionUser: one(users, {
    fields: [request.nextActionUserId],
    references: [users.id],
  }),
  purchasing: one(purchasing, {
    fields: [request.purchasingId],
    references: [purchasing.id],
  }),
  creator: one(users, {
    fields: [request.createdBy],
    references: [users.id],
  }),
}));

export const orderRelations = relations(order, ({ one }) => ({
  priorityLevel: one(priorityLevel, {
    fields: [order.priorityLevelId],
    references: [priorityLevel.id],
  }),
  nextActionUser: one(users, {
    fields: [order.nextActionUserId],
    references: [users.id],
  }),
  purchasing: one(purchasing, {
    fields: [order.purchasingId],
    references: [purchasing.id],
  }),
  creator: one(users, {
    fields: [order.createdBy],
    references: [users.id],
  }),
}));

export const canvassingRelations = relations(canvassing, ({ one, many }) => ({
  canvasPurchase: many(canvasPurchase),
  canvasService: many(canvasService),
  purchasing: one(purchasing, {
    fields: [canvassing.purchasingId],
    references: [purchasing.id],
  }),
  priorityLevel: one(priorityLevel, {
    fields: [canvassing.priorityLevelId],
    references: [priorityLevel.id],
  }),
  reviewer1: one(users, {
    fields: [canvassing.reviewer1Id],
    references: [users.id],
  }),
  reviewer2: one(users, {
    fields: [canvassing.reviewer2Id],
    references: [users.id],
  }),
  approver1: one(users, {
    fields: [canvassing.approver1Id],
    references: [users.id],
  }),
  approver2: one(users, {
    fields: [canvassing.approver2Id],
    references: [users.id],
  }),
  approver3: one(users, {
    fields: [canvassing.approver3Id],
    references: [users.id],
  }),
  nextActionUser: one(users, {
    fields: [canvassing.nextActionUserId],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [canvassing.createdBy],
    references: [users.id],
  }),
}));

export const canvasPurchaseAttachmentsRelations = relations(
  canvasPurchaseAttachments,
  ({ one }) => ({
    canvasPurchase: one(canvasPurchase, {
      fields: [canvasPurchaseAttachments.canvasRequestNo],
      references: [canvasPurchase.canvasRequestNo],
    }),
  }),
);

export const canvasPurchaseRelations = relations(
  canvasPurchase,
  ({ many, one }) => ({
    canvassing: one(canvassing, {
      fields: [canvasPurchase.canvasRequestNo],
      references: [canvassing.canvasRequestNo],
    }),
    itemDescription: one(itemDescription, {
      references: [itemDescription.id],
      fields: [canvasPurchase.itemDescriptionId],
    }),
    paymentOption: one(paymentOption, {
      references: [paymentOption.id],
      fields: [canvasPurchase.paymentOptionId],
    }),
    paymentMode: one(paymentMode, {
      references: [paymentMode.id],
      fields: [canvasPurchase.paymentModeId],
    }),
    methodOfDelivery: one(methodOfDelivery, {
      references: [methodOfDelivery.id],
      fields: [canvasPurchase.methodOfDeliveryId],
    }),
    reasonForRejection: one(reasonForRejection, {
      references: [reasonForRejection.id],
      fields: [canvasPurchase.reasonId],
    }),
    supplier: one(supplier, {
      references: [supplier.id],
      fields: [canvasPurchase.supplierId],
    }),
    attachments: many(canvasPurchaseAttachments),
  }),
);

export const canvasServiceAttachmentsRelations = relations(
  canvasServiceAttachments,
  ({ one }) => ({
    canvasService: one(canvasService, {
      fields: [canvasServiceAttachments.canvasRequestNo],
      references: [canvasService.canvasRequestNo],
    }),
  }),
);

export const canvasServiceRelations = relations(
  canvasService,
  ({ many, one }) => ({
    canvassing: one(canvassing, {
      fields: [canvasService.canvasRequestNo],
      references: [canvassing.canvasRequestNo],
    }),
    serviceDescription: one(serviceDescription, {
      references: [serviceDescription.id],
      fields: [canvasService.serviceDescriptionId],
    }),
    reasonForRejection: one(reasonForRejection, {
      references: [reasonForRejection.id],
      fields: [canvasService.reasonId],
    }),
    worker: one(manpower, {
      references: [manpower.id],
      fields: [canvasService.workerId],
    }),
    attachments: many(canvasServiceAttachments),
  }),
);

export const purchaseAttachmentsRelations = relations(
  purchaseAttachments,
  ({ one }) => ({
    purchase: one(purchase, {
      fields: [purchaseAttachments.purchaseId],
      references: [purchase.id],
    }),
  }),
);

export const purchaseRelations = relations(purchase, ({ one, many }) => ({
  reasonForRejection: one(reasonForRejection, {
    fields: [purchase.rejectionId],
    references: [reasonForRejection.id],
  }),
  requisition: one(requisition, {
    fields: [purchase.requisitionNo],
    references: [requisition.requisitionNo],
  }),
  itemCategory: one(itemCategory, {
    fields: [purchase.itemCategoryId],
    references: [itemCategory.id],
  }),
  itemDescription: one(itemDescription, {
    fields: [purchase.itemDescriptionId],
    references: [itemDescription.id],
  }),
  preferredSupplier: one(supplier, {
    fields: [purchase.preferredSupplierId],
    references: [supplier.id],
  }),
  purpose: one(purpose, {
    fields: [purchase.purposeId],
    references: [purpose.id],
  }),
  beneficialBranch: one(location, {
    fields: [purchase.beneficialBranchId],
    references: [location.id],
  }),
  unit: one(unit, {
    fields: [purchase.unitId],
    references: [unit.id],
  }),
  attachments: many(purchaseAttachments),
}));

export const serviceRequisitionAttachmentsRelations = relations(
  serviceRequisitionAttachments,
  ({ one }) => ({
    serviceRequisition: one(serviceRequisition, {
      fields: [serviceRequisitionAttachments.serviceRequisitionId],
      references: [serviceRequisition.id],
    }),
  }),
);

export const serviceRequisitionRelations = relations(
  serviceRequisition,
  ({ one, many }) => ({
    requisition: one(requisition, {
      fields: [serviceRequisition.requisitionNo],
      references: [requisition.requisitionNo],
    }),
    serviceCategory: one(serviceCategory, {
      fields: [serviceRequisition.serviceCategoryId],
      references: [serviceCategory.id],
    }),
    serviceDescription: one(serviceDescription, {
      fields: [serviceRequisition.serviceDescriptionId],
      references: [serviceDescription.id],
    }),
    preferredWorker: one(manpower, {
      fields: [serviceRequisition.preferredWorkerId],
      references: [manpower.id],
    }),
    purpose: one(purpose, {
      fields: [serviceRequisition.purposeId],
      references: [purpose.id],
    }),
    location: one(location, {
      fields: [serviceRequisition.locationId],
      references: [location.id],
    }),
    attachments: many(serviceRequisitionAttachments),
    reasonForRejection: one(reasonForRejection, {
      fields: [serviceRequisition.rejectionId],
      references: [reasonForRejection.id],
    }),
  }),
);

export const requisitionRelations = relations(requisition, ({ one, many }) => ({
  requisitionType: one(requisitionType, {
    fields: [requisition.requisitionTypeId],
    references: [requisitionType.id],
  }),
  canvassingSR: many(canvasService),
  canvassingPR: many(canvasPurchase),
  creator: one(users, {
    fields: [requisition.createdBy],
    references: [users.id],
  }),
  priorityLevel: one(priorityLevel, {
    fields: [requisition.priorityLevelId],
    references: [priorityLevel.id],
  }),
  purchasing: one(purchasing, {
    fields: [requisition.purchasingId],
    references: [purchasing.id],
  }),
  nextActionUser: one(users, {
    fields: [requisition.nextActionUserId],
    references: [users.id],
  }),
}));

export const supplierRelations = relations(supplier, ({ one }) => ({
  bank: one(bank, {
    fields: [supplier.bankId],
    references: [bank.id],
  }),
  industry: one(industry, {
    fields: [supplier.industryId],
    references: [industry.id],
  }),
  region: one(region, {
    fields: [supplier.regionId],
    references: [region.id],
  }),
  city: one(city, {
    fields: [supplier.cityId],
    references: [city.id],
  }),
  barangay: one(barangay, {
    fields: [supplier.barangayId],
    references: [barangay.id],
  }),
}));

export const serviceDescriptionRelations = relations(
  serviceDescription,
  ({ one }) => ({
    serviceCategory: one(serviceCategory, {
      fields: [serviceDescription.serviceCategoryId],
      references: [serviceCategory.id],
    }),
  }),
);

export const itemDescriptionRelations = relations(
  itemDescription,
  ({ one }) => ({
    itemCategory: one(itemCategory, {
      fields: [itemDescription.itemCategoryId],
      references: [itemCategory.id],
    }),
  }),
);

export const serviceCategoryRelations = relations(
  serviceCategory,
  ({ one }) => ({
    budgetSource: one(budgetSource, {
      fields: [serviceCategory.budgetSourceId],
      references: [budgetSource.id],
    }),
    opexCategory: one(opexCategory, {
      fields: [serviceCategory.opexCategoryId],
      references: [opexCategory.id],
    }),
    chartOfAccounts: one(chartOfAccounts, {
      fields: [serviceCategory.chartOfAccountsId],
      references: [chartOfAccounts.id],
    }),
    subAccounts: one(subAccounts, {
      fields: [serviceCategory.subAccountsId],
      references: [subAccounts.id],
    }),
    yearlyBudget: one(yearlyBudget, {
      fields: [serviceCategory.chartOfAccountsId],
      references: [yearlyBudget.chartOfAccountsId],
    }),
  }),
);

export const itemCategoryRelations = relations(itemCategory, ({ one }) => ({
  budgetSource: one(budgetSource, {
    fields: [itemCategory.budgetSourceId],
    references: [budgetSource.id],
  }),
  opexCategory: one(opexCategory, {
    fields: [itemCategory.opexCategoryId],
    references: [opexCategory.id],
  }),
  chartOfAccounts: one(chartOfAccounts, {
    fields: [itemCategory.chartOfAccountsId],
    references: [chartOfAccounts.id],
  }),
  subAccounts: one(subAccounts, {
    fields: [itemCategory.subAccountsId],
    references: [subAccounts.id],
  }),
  yearlyBudget: one(yearlyBudget, {
    fields: [itemCategory.chartOfAccountsId],
    references: [yearlyBudget.chartOfAccountsId],
  }),
}));

export const availmentRelations = relations(availment, ({ one }) => ({
  budgetSource: one(budgetSource, {
    fields: [availment.budgetSourceId],
    references: [budgetSource.id],
  }),
  opexCategory: one(opexCategory, {
    fields: [availment.opexId],
    references: [opexCategory.id],
  }),
  chartOfAccounts: one(chartOfAccounts, {
    fields: [availment.coaId],
    references: [chartOfAccounts.id],
  }),
  subAccounts: one(subAccounts, {
    fields: [availment.subAccountId],
    references: [subAccounts.id],
  }),
  yearlyBudget: one(yearlyBudget, {
    fields: [availment.coaId, availment.opexId, availment.year],
    references: [
      yearlyBudget.chartOfAccountsId,
      yearlyBudget.opexCategoryId,
      yearlyBudget.year,
    ],
  }),
}));

export const chartOfAccountsRelations = relations(
  chartOfAccounts,
  ({ many }) => ({
    yearlyBudget: many(yearlyBudget),
    serviceCategory: many(serviceCategory),
    itemCategory: many(itemCategory),
  }),
);

export const yearlyBudgetRelations = relations(
  yearlyBudget,
  ({ one, many }) => ({
    chartOfAccounts: one(chartOfAccounts, {
      fields: [yearlyBudget.chartOfAccountsId],
      references: [chartOfAccounts.id],
    }),
    opexCategory: one(opexCategory, {
      fields: [yearlyBudget.opexCategoryId],
      references: [opexCategory.id],
    }),
    division: one(budgetSource, {
      fields: [yearlyBudget.divisionId],
      references: [budgetSource.id],
    }),
    availment: many(availment),
    itemCategory: many(itemCategory),
    serviceCategory: many(serviceCategory),
  }),
);

export const recurringRequisitionRelations = relations(
  recurring,
  ({ one, many }) => ({
    requisition: one(requisition, {
      fields: [recurring.requisitionNo],
      references: [requisition.requisitionNo],
    }),
    airline: many(airline),
    utility: many(utility),
    rental: many(rental),
    subscription: many(subscriptionDetail),
    category: one(serviceCategory, {
      fields: [recurring.serviceCategoryId],
      references: [serviceCategory.id],
    }),
  }),
);

export const airlineRelations = relations(airline, ({ one, many }) => ({
  recurring: one(recurring, {
    fields: [airline.referenceNo],
    references: [recurring.requisitionNo],
  }),
  transportMode: one(transportMode, {
    references: [transportMode.id],
    fields: [airline.transportModeId],
  }),
  carrier: one(carrier, {
    references: [carrier.id],
    fields: [airline.carrierId],
  }),
  attachments: many(airlineAttachments),
}));

export const airlineAttachmentsRelations = relations(
  airlineAttachments,
  ({ one }) => ({
    airline: one(airline, {
      references: [airline.id],
      fields: [airlineAttachments.airlineId],
    }),
  }),
);

export const utilityRelations = relations(utility, ({ one, many }) => ({
  recurring: one(recurring, {
    fields: [utility.referenceNo],
    references: [recurring.requisitionNo],
  }),
  utilityType: one(utilityType, {
    references: [utilityType.id],
    fields: [utility.utilityTypeId],
  }),
  serviceProvider: one(serviceProvider, {
    references: [serviceProvider.id],
    fields: [utility.serviceProviderId],
  }),
  attachments: many(utilityAttachments),
}));

export const utilityAttachmentsRelations = relations(
  utilityAttachments,
  ({ one }) => ({
    utility: one(utility, {
      references: [utility.id],
      fields: [utilityAttachments.utilityId],
    }),
  }),
);

export const rentalRelations = relations(rental, ({ one, many }) => ({
  recurring: one(recurring, {
    fields: [rental.referenceNo],
    references: [recurring.requisitionNo],
  }),
  hub: one(hub, {
    references: [hub.id],
    fields: [rental.hubId],
  }),
  leasor: one(leasor, {
    references: [leasor.id],
    fields: [rental.leasorId],
  }),
  attachments: many(rentalsAttachments),
}));

export const rentalAttachmentsRelations = relations(
  rentalsAttachments,
  ({ one }) => ({
    rental: one(rental, {
      references: [rental.id],
      fields: [rentalsAttachments.rentalId],
    }),
  }),
);

export const subscriptionDetailRelations = relations(
  subscriptionDetail,
  ({ one, many }) => ({
    recurring: one(recurring, {
      fields: [subscriptionDetail.referenceNo],
      references: [recurring.requisitionNo],
    }),
    subscription: one(subscription, {
      references: [subscription.id],
      fields: [subscriptionDetail.subscriptionId],
    }),
    provider: one(provider, {
      references: [provider.id],
      fields: [subscriptionDetail.providerId],
    }),
    attachments: many(subscriptionsAttachments),
  }),
);

export const subscriptionDetailAttachmentsRelations = relations(
  subscriptionsAttachments,
  ({ one }) => ({
    subscriptionDetail: one(subscriptionDetail, {
      references: [subscriptionDetail.id],
      fields: [subscriptionsAttachments.subscriptionId],
    }),
  }),
);

export const rfpRelations = relations(rfp, ({ one, many }) => ({
  requestor: one(users, {
    references: [users.id],
    fields: [rfp.requestorId],
  }),
  payee: one(users, {
    references: [users.id],
    fields: [rfp.payeeId],
  }),
  subPayee: one(users, {
    references: [users.id],
    fields: [rfp.subPayee],
  }),
  priorityLevel: one(priorityLevel, {
    references: [priorityLevel.id],
    fields: [rfp.priorityLevelId],
  }),
  budgetSource: one(budgetSource, {
    references: [budgetSource.id],
    fields: [rfp.budgetSourceId],
  }),
  chartOfAccounts: one(chartOfAccounts, {
    references: [chartOfAccounts.id],
    fields: [rfp.chartOfAccountId],
  }),
  subAccounts: one(subAccounts, {
    references: [subAccounts.id],
    fields: [rfp.subAccountId],
  }),
  opexCategory: one(opexCategory, {
    references: [opexCategory.id],
    fields: [rfp.opexCategoryId],
  }),
  attachments: many(rfpAttachments),
  purchasing: one(purchasing, {
    fields: [rfp.purchasingId],
    references: [purchasing.id],
  }),
  particulars: many(rfpParticulars),
  nextActionUser: one(users, {
    references: [users.id],
    fields: [rfp.nextActionUserId],
  }),
  firstApprover: one(users, {
    references: [users.id],
    fields: [rfp.approver1Id],
  }),
  secondApprover: one(users, {
    references: [users.id],
    fields: [rfp.approver2Id],
  }),
  thirdApprover: one(users, {
    references: [users.id],
    fields: [rfp.approver3Id],
  }),
}));

export const rfpParticularsRelations = relations(rfpParticulars, ({ one }) => ({
  rfp: one(rfp, {
    fields: [rfpParticulars.rfpNo],
    references: [rfp.rfpNo],
  }),
}));

export const rfpAttachmentsRelations = relations(rfpAttachments, ({ one }) => ({
  rfp: one(rfp, {
    references: [rfp.rfpNo],
    fields: [rfpAttachments.rfpNo],
  }),
}));

export const checkVoucherRelations = relations(
  checkVoucher,
  ({ one, many }) => ({
    nextActionUser: one(users, {
      references: [users.id],
      fields: [checkVoucher.nextActionUserId],
    }),
    rfp: one(rfp, {
      fields: [checkVoucher.rfpNo],
      references: [rfp.rfpNo],
    }),
    orSiNumber: many(checkVoucherOrSiNumber),
    firstReviewer: one(users, {
      references: [users.id],
      fields: [checkVoucher.reviewer1Id],
    }),
    firstApprover: one(users, {
      references: [users.id],
      fields: [checkVoucher.approver1Id],
    }),
  }),
);

export const checkVoucherOrSiNumberRelations = relations(
  checkVoucherOrSiNumber,
  ({ one }) => ({
    checkVoucher: one(checkVoucher, {
      fields: [checkVoucherOrSiNumber.cvNo],
      references: [checkVoucher.cvNo],
    }),
  }),
);

export const accessRightsRelations = relations(accessRights, ({ one }) => ({
  access: one(access, {
    fields: [accessRights.accessId],
    references: [access.id],
  }),
}));
