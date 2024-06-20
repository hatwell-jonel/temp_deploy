import { db } from "@/db";
import {
  bank,
  carrier,
  cashAdvanceType,
  hub,
  leasor,
  methodOfDelivery,
  paymentMode,
  paymentOption,
  priorityLevel,
  provider,
  requisitionType,
  serviceProvider,
  subModule,
  subscription,
  transportMode,
  utilityType,
} from "./schema/fims";

const banks = ["Metrobank", "BDO"];
const requisitionTypes = [
  "Service Requisition",
  "Purchase Requisition",
  "CR - Service Requisition",
  "CR - Purchase Requisition",
  "Recurring - Service Requisition",
];

const priorityLevelValues = [
  {
    id: 1,
    name: "Critically Important",
    description: "Critically Important (3-5 Days)",
    daysMin: 3,
    daysMax: 5,
  },
  {
    id: 2,
    name: "Very Important",
    description: "Very Important (5-7 Days)",
    daysMin: 5,
    daysMax: 7,
  },
  {
    id: 3,
    name: "Important",
    description: "Important (7-10 Days)",
    daysMin: 7,
    daysMax: 10,
  },
  {
    id: 4,
    name: "Less Important",
    description: "Less Important (More Than 10 Days)",
    daysMin: 10,
    daysMax: 11,
  },
];

const paymentOptions = [
  {
    id: 1,
    name: "One-Time",
  },
  {
    id: 2,
    name: "Installment",
  },
];

const paymentModes = [
  {
    id: 1,
    name: "Cash",
  },
  {
    id: 2,
    name: "Check",
  },
  {
    id: 3,
    name: "Online",
  },
];

const methodOfDeliverys = [
  { id: 1, name: "Pick-Up" },
  { id: 2, name: "Delivery" },
];

const subModules = [
  { id: 1, name: "Requisition" },
  { id: 2, name: "Canvas Request" },
  { id: 3, name: "Service and Purchase Request" },
  { id: 4, name: "Job and Purchase Order" },
  { id: 5, name: "Request for Payment" },
  { id: 6, name: "Check Voucher" },
  { id: 7, name: "Cash Advance" },
];

const transportModes = [
  { id: 1, name: "Air Freight" },
  { id: 2, name: "Sea Freight" },
  { id: 3, name: "Land Freight" },
];

const carriers = [
  { id: 1, name: "PAL", transportModeId: 1 },
  { id: 2, name: "Cebu Pacific", transportModeId: 1 },
  { id: 3, name: "Air Asia", transportModeId: 1 },
  { id: 4, name: "2Go", transportModeId: 3 },
  { id: 5, name: "Solid SL", transportModeId: 2 },
  { id: 6, name: "3PL", transportModeId: 2 },
  { id: 7, name: "Organic WV", transportModeId: 3 },
];

const utilityTypes = [
  { id: 1, name: "Utility 1" },
  { id: 2, name: "Utility 2" },
];

const serviceProviders = [
  { id: 1, name: "Service Provider 1" },
  { id: 2, name: "Service Provider 2" },
];

const hubs = [
  { id: 1, name: "Hub/Office 1" },
  { id: 2, name: "Hub/Office 2" },
];

const leasors = [
  { id: 1, name: "Leasor 1" },
  { id: 2, name: "Leasor 2" },
];

const subscriptions = [
  { id: 1, name: "Subscription 1" },
  { id: 2, name: "Subscription 2" },
];

const providers = [
  { id: 1, name: "Provider 1" },
  { id: 2, name: "Provider 2" },
];

const cashAdvanceTypes = [
  { id: 1, name: "Petty Cash" },
  { id: 2, name: "Freight" },
  { id: 3, name: "Single Transaction" },
  { id: 4, name: "Revolving Funds" },
  { id: 5, name: "Trainings & Seminars" },
  { id: 6, name: "Business Trip" },
];

const main = async () => {
  console.log("Seed start");
  console.log("Seeding requisitionType");
  await db
    .insert(requisitionType)
    .values(requisitionTypes.map((v, index) => ({ id: index + 1, name: v })))
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Bank");
  await db
    .insert(bank)
    .values(banks.map((v, index) => ({ id: index + 1, name: v })))
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Priority Level");
  await db
    .insert(priorityLevel)
    .values(priorityLevelValues)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Payment Option");
  await db
    .insert(paymentOption)
    .values(paymentOptions)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Payment Modes");
  await db
    .insert(paymentMode)
    .values(paymentModes)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Method of Deliveries");
  await db
    .insert(methodOfDelivery)
    .values(methodOfDeliverys)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Sub Modules");
  await db
    .insert(subModule)
    .values(subModules)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Transport Modes");
  await db
    .insert(transportMode)
    .values(transportModes)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Carriers");
  await db
    .insert(carrier)
    .values(carriers)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Utility Type");
  await db
    .insert(utilityType)
    .values(utilityTypes)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Service Provider");
  await db
    .insert(serviceProvider)
    .values(serviceProviders)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Hubs");
  await db
    .insert(hub)
    .values(hubs)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Leasors");
  await db
    .insert(leasor)
    .values(leasors)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Subscription");
  await db
    .insert(subscription)
    .values(subscriptions)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Provider");
  await db
    .insert(provider)
    .values(providers)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seeding Cash Advance Type");
  await db
    .insert(cashAdvanceType)
    .values(cashAdvanceTypes)
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: new Date(),
      },
    });
  console.log("Seed done");
};

main();
