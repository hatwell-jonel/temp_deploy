import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import { TitleCard } from "@/components/cards/title";
import { DatePickerWithPresets } from "@/components/date-picker";
import { Loading } from "@/components/fallbacks";
import { Icons } from "@/components/icons";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Suspense } from "react";
import {
  getCategories,
  getDescriptions,
  getLocations,
  getPreferredSupplier,
  getPurposes,
  getUnits,
} from "../helpers";
import { Form, TableRowForm } from "./client";

const title = "Purchase Requisition Form";

export const metadata = {
  title,
};

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page(props: PageProps) {
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/purchasing/snp-requisition/purchase"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              {title}
            </>
          }
        />
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <Suspense fallback={<Loading />}>
            <FormTable />
          </Suspense>
        </section>
      </div>
    </>
  );
}

export async function FormTable() {
  const [
    categories,
    descriptions,
    units,
    locations,
    preferredSuppliers,
    purposes,
  ] = await Promise.all([
    getCategories(),
    getDescriptions(),
    getUnits(),
    getLocations(),
    getPreferredSupplier(),
    getPurposes(),
  ]);
  return (
    <Form className="space-y-4 rounded-md bg-background p-4 text-xs">
      <div className="flex items-center gap-2">
        <div className="mr-4">Delivery Date : </div>
        <DatePickerWithPresets name="endDate" />
        <input type="hidden" name="requisitionTypeId" value={2} />
      </div>
      <div className="w-full overflow-x-auto rounded-md border-2 bg-background py-2 shadow-lg">
        <Table className="w-screen text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-foreground">
                Item Category
              </TableHead>
              <TableHead className="text-center text-foreground">
                Item Description
              </TableHead>
              <TableHead className="text-center text-foreground">Qty</TableHead>
              <TableHead className="text-center text-foreground">
                Unit
              </TableHead>
              <TableHead className="text-center text-foreground">
                Estimated Price
              </TableHead>
              <TableHead className="text-center text-foreground">
                Estimated Total
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Purpose</div>
                <div className="text-muted-foreground italic">(Optional)</div>
              </TableHead>
              <TableHead className="text-center text-foreground">
                Beneficiary Branch
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Preferred Supplier</div>
                <div className="text-muted-foreground italic">(Optional)</div>
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Remarks</div>
                <div className="text-muted-foreground italic">(Optional)</div>
              </TableHead>
              <TableHead className="text-center text-foreground">
                Sample Product
              </TableHead>
              <TableHead className="text-center text-foreground">
                Attachment
              </TableHead>
              <TableHead className="text-center text-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Suspense>
              <TableRowForm
                categories={categories}
                descriptions={descriptions}
                locations={locations}
                preferredSuppliers={preferredSuppliers}
                purposes={purposes}
                units={units}
              />
            </Suspense>
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <CancelButton>Cancel</CancelButton>
        <SubmitButton>Submit</SubmitButton>
      </div>
    </Form>
  );
}
