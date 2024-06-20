import type { MainNavItem } from "@/types";

export const site = {
  name: "CIS V3",
  description:
    "CaPEx Integrated System built with Nextjs 14 Server Components, React, Nodejs and TailwindCSS.",
  url: "https://cisv3-accounting.vercel.app",
};

// admin, fims, ims, oims, crm, hrims, cts
export const MainNav: MainNavItem[] = [
  {
    title: "admin",
    href: "/admin",
    sideNav: [
      {
        title: "Access Management",
        href: "/admin/access",
        defaultPath: "/admin/access/resource",
        icon: "dashboard",
        subItems: [
          {
            title: "Access Resource",
            href: "/admin/access/resource",
          },
          {
            title: "Access Rights",
            href: "/admin/access/rights",
          },
        ],
      },
    ],
  },
  {
    title: "fims",
    href: "/fims",
    sideNav: [
      {
        title: "Reports",
        href: "/fims/reports",
        defaultPath: "/fims/reports/credit-mgmt",
        icon: "dashboard",
        subItems: [
          {
            title: "Credit Management Reports",
            href: "/fims/reports/credit-mgmt",
          },
          { title: "Purchasing Reports", href: "/fims/reports/purchasing" },
          { title: "Accounting Reports", href: "/fims/reports/accounting" },
        ],
      },
      {
        title: "Credit Management",
        href: "/fims/credit",
        defaultPath: "/fims/credit/lorem",
        icon: "peso",
        subItems: [{ title: "Lorem Ipsum", href: "/fims/credit/lorem" }],
      },
      {
        title: "Purchasing",
        href: "/fims/purchasing",
        defaultPath: "/fims/purchasing/snp-requisition",
        icon: "cart",
        subItems: [
          {
            title: "Service & Purchase Requisition",
            href: "/fims/purchasing/snp-requisition",
          },
          {
            title: "Canvas Request",
            href: "/fims/purchasing/canvas-request/approval",
          },
          {
            title: "Service & Purchase Request",
            href: "/fims/purchasing/snp-request",
          },
          {
            title: "Job & Purchase Order",
            href: "/fims/purchasing/job-purchase-order",
          },
          {
            title: "Data Management",
            href: "/fims/purchasing/data-mgmt",
          },
          {
            title: "Supplier Management",
            href: "/fims/purchasing/supplier-mgmt",
          },
          {
            title: "Manpower Management",
            href: "/fims/purchasing/manpower-mgmt",
          },
        ],
      },
      {
        title: "Accounting",
        defaultPath: "/fims/accounting/lorem",
        href: "/fims/accounting",
        icon: "calculator",
        subItems: [
          {
            title: "Request for Payment",
            href: "/fims/accounting/rfp",
          },
          {
            title: "Cash Advance",
            href: "/fims/accounting/cash-advance",
          },
          {
            title: "Check Voucher",
            href: "/fims/accounting/check-voucher",
          },
          {
            title: "Liquidation",
            href: "/fims/accounting/liquidation",
          },
          {
            title: "Budget Management",
            href: "/fims/accounting/budget-plan",
          },
          {
            title: "LOA Management",
            href: "/fims/accounting/loa-mgmt",
          },
          {
            title: "SLA Management",
            href: "/fims/accounting/sla-mgmt",
          },
        ],
      },
    ],
  },
  {
    title: "ims",
    href: "/ims",
    disabled: true,
  },
  {
    title: "oims",
    href: "/oims",
    disabled: true,
    // sideNav: [
    //   {
    //     title: "Reports",
    //     href: "/oims/reports",
    //     defaultPath: "/oims/reports/order",
    //     icon: "dashboard",
    //     subItems: [
    //       { title: "Order Management Reports", href: "/oims/reports/order" },
    //       { title: "Cargo Status Reports", href: "/oims/reports/cargo-status" },
    //       {
    //         title: "Warehouse Management Reports",
    //         href: "/oims/reports/warehouse",
    //       },
    //       { title: "Fleet Management Reports", href: "/oims/reports/fleet" },
    //       {
    //         title: "Carrier Management Reports",
    //         href: "/oims/reports/carrier",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Order Management",
    //     href: "/oims/order",
    //     defaultPath: "/oims/order/team-route",
    //     icon: "truck",
    //     subItems: [
    //       { title: "Team Route Assignment", href: "/oims/order/team-route" },
    //       { title: "Dispatch Console", href: "/oims/order/dispatch-console" },
    //       { title: "e-DTR", href: "/oims/order/e-dtr" },
    //       { title: "Transaction Entry", href: "/oims/order/transaction-entry" },
    //       {
    //         title: "Transaction Summary",
    //         href: "/oims/order/transaction-summary",
    //       },
    //       {
    //         title: "Vehicle Utilization",
    //         href: "/oims/order/vehicle-utilization",
    //       },
    //       {
    //         title: "Transaction Entry Dropdown Management",
    //         href: "/oims/order/transaction-entry-dropdown-management",
    //       },
    //       { title: "Waybill Registry", href: "/oims/order/waybill-registry" },
    //     ],
    //   },
    //   {
    //     title: "Cargo Status Management",
    //     defaultPath: "/oims/cargo-status/tagging",
    //     href: "/oims/cargo-status",
    //     icon: "boxes",
    //     subItems: [
    //       { title: "Cargo Status Tagging", href: "/oims/cargo-status/tagging" },
    //       {
    //         title: "Track and Trace",
    //         href: "/oims/cargo-status/track-and-trace",
    //       },
    //       {
    //         title: "Air Freight Master Tracker",
    //         href: "/oims/cargo-status/air-tracker",
    //       },
    //       {
    //         title: "Sea Freight Master Tracker",
    //         href: "/oims/cargo-status/sea-tracker",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Warehouse Management",
    //     defaultPath: "/oims/warehouse/cargo-inventory",
    //     href: "/oims/warehouse",
    //     icon: "warehouse",
    //     subItems: [
    //       {
    //         title: "Cargo Inventory Management",
    //         href: "/oims/warehouse/cargo-inventory",
    //       },
    //       {
    //         title: "Packing and Crating Management",
    //         href: "/oims/warehouse/packing",
    //       },
    //       {
    //         title: "Reverse Logistics",
    //         href: "/oims/warehouse/reverse-logistics",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Fleet Management",
    //     href: "/oims/fleet",
    //     defaultPath: "/oims/fleet/asset",
    //     icon: "car",
    //     subItems: [
    //       { title: "Fleet Asset", href: "/oims/fleet/asset" },
    //       {
    //         title: "Checklist Monitoring",
    //         href: "/oims/fleet/checklist-monitoring",
    //       },
    //       { title: "Job Orders", href: "/oims/fleet/job-orders" },
    //       {
    //         title: "Preventive Maintenance Schedule",
    //         href: "/oims/fleet/maintenance-schedule",
    //       },
    //       {
    //         title: "Parts and Supplies Monitoring",
    //         href: "/oims/fleet/parts-monitoring",
    //       },
    //       {
    //         title: "Vehicle Location Tracker",
    //         href: "/oims/fleet/location-tracker",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Carrier Management",
    //     href: "/oims/carrier",
    //     defaultPath: "/oims/carrier",
    //     icon: "truckLoad",
    //     subItems: [
    //       {
    //         href: "/oims/carrier",
    //         title: "Lorem Ipsum",
    //       },
    //     ],
    //   },
    // ],
  },
  {
    title: "crm",
    href: "/crm",
    disabled: true,
  },
  {
    title: "hrims",
    href: "/hrims",
    disabled: true,
  },
  {
    title: "cts",
    href: "/cts",
    disabled: true,
  },
];

export const pathToLand = "/fims/purchasing/data-mgmt";
