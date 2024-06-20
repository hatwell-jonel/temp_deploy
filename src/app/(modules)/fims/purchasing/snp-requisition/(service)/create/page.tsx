import AttachmentButtonInput from "@/components/buttons/attachment";
import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import { TitleCard } from "@/components/cards/title";
import { DatePickerWithPresets } from "@/components/date-picker";
import { Loading } from "@/components/fallbacks";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { serviceRequisitionCreateSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import type { z } from "zod";
import {
  getCategories,
  getDescriptions,
  getLocations,
  getPreferredWorkers,
  getPurposes,
} from "../helpers";
import { AutoCalculateEstimatedRate, CategorySelect, Form } from "./client";

const title = "Service Requisition Form";

export const metadata = {
  title,
};

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page(props: PageProps) {
  const searchParams = serviceRequisitionCreateSearchParams.parse(
    props.searchParams,
  );
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/purchasing/snp-requisition"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              {title}
            </>
          }
        />
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <Suspense fallback={<Loading />}>
            <FormTable searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

export async function FormTable({
  searchParams,
}: {
  searchParams: z.infer<typeof serviceRequisitionCreateSearchParams>;
}) {
  const [categories, descriptions, locations, preferredWorkers, purposes] =
    await Promise.all([
      getCategories(),
      getDescriptions(searchParams.categoryId),
      getLocations(),
      getPreferredWorkers(),
      getPurposes(),
    ]);
  return (
    <Form className="w-full space-y-4 rounded-md bg-background p-4 text-xs">
      <input type="hidden" name="requisitionTypeId" value={1} />
      <div className="flex items-center gap-2">
        <div className="min-w-36">Expected Start Date : </div>
        <DatePickerWithPresets name="startDate" />
      </div>
      <div className="flex items-center gap-2">
        <div className="min-w-36">Expected End Date : </div>
        <DatePickerWithPresets name="endDate" />
      </div>
      <div className="rounded-md border-2 bg-background py-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="*:whitespace-nowrap">
              <TableHead className="text-center text-foreground">
                Service Category
              </TableHead>
              <TableHead className="text-center text-foreground">
                Service Description
              </TableHead>
              <TableHead className="text-center text-foreground">
                Number of Workers
              </TableHead>
              <TableHead className="text-center text-foreground">
                Man Hours
              </TableHead>
              <TableHead className="text-center text-foreground">
                Estimated Rate
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Preferred Worker</div>
                <div className="text-muted-foreground italic">(Optional)</div>
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Purpose</div>
                <div className="text-muted-foreground italic">(Optional)</div>
              </TableHead>
              <TableHead className="text-center text-foreground">
                Location
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Comments</div>
                <div className="text-muted-foreground italic">(Optional)</div>
              </TableHead>
              <TableHead className="text-center text-foreground">
                Attachment
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="px-1.5 text-center">
                <CategorySelect>
                  <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="Service Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem value={String(item.id)} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </CategorySelect>
              </TableCell>
              <AutoCalculateEstimatedRate descriptions={descriptions} />
              <TableCell className="px-1.5 text-center">
                <Select name="preferredWorker">
                  <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="Preferred Worker" />
                  </SelectTrigger>
                  <SelectContent>
                    {preferredWorkers.map((item) => (
                      <SelectItem value={String(item.id)} key={item.id}>
                        {item.agency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="px-1.5 text-center">
                <Select name="purpose">
                  <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="Purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {purposes.map((item) => (
                      <SelectItem value={String(item.id)} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="px-1.5 text-center">
                <Select name="location">
                  <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((item) => (
                      <SelectItem value={String(item.id)} key={item.id}>
                        {item.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="px-1.5 text-center">
                <Input name="comments" className="w-[180px]" />
              </TableCell>
              <TableCell className="px-1.5 text-center">
                <AttachmentButtonInput name="file" multiple />
              </TableCell>
            </TableRow>
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
