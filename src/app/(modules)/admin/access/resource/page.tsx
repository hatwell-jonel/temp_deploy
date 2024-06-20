import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { Pagination } from "@/components/pagination";
import Search from "@/components/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  accessSearchParams,
  type budgetSourceSearchParams,
} from "@/validations/searchParams";
import { Suspense } from "react";
import type { z } from "zod";
import { CreateForm, EditForm, ToggleSwitch } from "./client";
import { getTableData } from "./helpers";

const title = "Access Item";
const searchPlaceholder = "Access Path";
const inputVariable = "path";

export const metadata = {
  title,
};

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  const parsed = accessSearchParams.parse(searchParams);
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard title={title}>
          <CreateForm title={title} />
        </TitleCard>
        <Suspense>
          <Search
            placeholder={searchPlaceholder}
            inputVariable={inputVariable}
          />
        </Suspense>
        <section>
          <Suspense fallback={<Loading />}>
            <TableData searchParams={parsed} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function TableData({
  searchParams,
}: {
  searchParams: z.infer<typeof budgetSourceSearchParams>;
}) {
  const { data, meta } = await getTableData({ searchParams });
  const currentPage = searchParams.page || 1;
  const startingNumber = (currentPage - 1) * 10 + 1;
  return (
    <>
      <div className="rounded-md bg-background py-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">No.</TableHead>
              <TableHead className="text-center">Access Item</TableHead>
              <TableHead className="flex items-center justify-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, index) => (
              <TableRow key={d.id} className="odd:bg-[#F9FAFB]">
                <TableCell className="text-center font-medium">
                  {index + startingNumber}
                </TableCell>
                <TableCell className="text-center">{d.name}</TableCell>
                <TableCell className="flex justify-center gap-2">
                  <EditForm defaultValues={d} />
                  <ToggleSwitch defaultValue={d.status === 1} id={d.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination meta={meta} />
    </>
  );
}
