import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { recurringRequisitionCreateSearchParams as searchParamsSchema } from "@/validations/searchParams";
import { Suspense } from "react";
import { getServiceCategories } from "../helpers";
import { SelectCategory } from "./client";
import {
  AirlineTable,
  RentalsTable,
  SubscriptionTable,
  UtilitiesTable,
} from "./tables";

export const metadata = {
  title: "Recurring - Service Requisition Form",
};

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function CreatePage({ searchParams }: PageProps) {
  const { apCategory, rentalType } = searchParamsSchema.parse(searchParams);
  return (
    <section className="space-y-4">
      <div className="font-bold text-lg text-primary">
        Recurring - Service Requisition Form
      </div>
      <div className="flex items-center gap-6">
        <Label htmlFor="apCategory">AP Category: </Label>
        <Suspense fallback={<Icons.spinner className="size-5 animate-spin" />}>
          <SelectCategory
            defaultValue={apCategory ? String(apCategory) : undefined}
          >
            <SelectTrigger className="w-[180px] text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <Suspense>
              <SelectContentAPCategory />
            </Suspense>
          </SelectCategory>
        </Suspense>
      </div>
      <Suspense key={apCategory}>
        {apCategory === "Airline" && <AirlineTable />}
        {apCategory === "Utilities" && <UtilitiesTable />}
        {apCategory === "Rentals" && <RentalsTable type={rentalType} />}
        {apCategory === "Subscription" && <SubscriptionTable />}
      </Suspense>
    </section>
  );
}

async function SelectContentAPCategory() {
  const categories = await getServiceCategories();
  return (
    <SelectContent>
      {categories.map((item) => (
        <SelectItem value={item.name} key={item.id}>
          {item.name}
        </SelectItem>
      ))}
    </SelectContent>
  );
}
