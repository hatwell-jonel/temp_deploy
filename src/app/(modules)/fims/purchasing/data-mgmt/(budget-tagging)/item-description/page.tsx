import { SubmitButton } from "@/components/buttons/submit";
import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { FilterTabs1 } from "@/components/filter-tabs";
import { Icons } from "@/components/icons";
import { Pagination } from "@/components/pagination";
import PesoInputDecor from "@/components/peso-input-decor";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
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
import { budgetSourceSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import type { z } from "zod";
import { CreateForm, EditForm, ToggleSwitch } from "./client";
import { fetchTabs, getCategories, getTableData } from "./helpers";

const title = "Item Description";
const searchPlaceholder = "Item Description";
const inputVariable = "name";

export const metadata = {
  title,
};

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  const parsed = budgetSourceSearchParams.parse(searchParams);
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/purchasing/data-mgmt"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              {title}
            </>
          }
        >
          <CreateForm title={title}>
            <div className="flex w-full flex-1 gap-2">
              <SelectCategory />
              <Input
                name="description"
                placeholder="Item Description "
                className="w-1/3 text-xs"
              />
              <div className="relative w-1/3">
                <Input name="price" className="w-full pl-6 text-xs" />
                <PesoInputDecor />
              </div>
            </div>
          </CreateForm>
        </TitleCard>
        <Suspense>
          <Search
            placeholder={searchPlaceholder}
            inputVariable={inputVariable}
          />
        </Suspense>
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <Suspense>
            <FilterTab />
          </Suspense>
          <Suspense fallback={<Loading />}>
            <TableData searchParams={parsed} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function SelectCategory({ defaultValue }: { defaultValue?: string }) {
  const categories = await getCategories();
  return (
    <Select name="categoryId" defaultValue={defaultValue}>
      <SelectTrigger className="w-1/3 text-xs">
        <SelectValue placeholder="Item Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((item) => (
          <SelectItem value={String(item.id)} key={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

async function FilterTab() {
  const tabs = await fetchTabs();
  return (
    <FilterTabs1
      searchParamsName="status"
      tabs={tabs}
      className="capitalize lg:w-24"
    />
  );
}

async function TableData({
  searchParams,
}: {
  searchParams: z.infer<typeof budgetSourceSearchParams>;
}) {
  const { data, meta } = await getTableData({ searchParams });
  return (
    <>
      <div className="rounded-md bg-background py-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">No.</TableHead>
              <TableHead className="text-center">Item Category</TableHead>
              <TableHead className="text-center">Item Description</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, index) => (
              <TableRow key={d.id} className="odd:bg-[#F9FAFB]">
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="text-center">
                  {d.itemCategory.name}
                </TableCell>
                <TableCell className="text-center">{d.description}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <EditForm id={d.id}>
                      <div className="flex w-full flex-1 text-primary text-xs">
                        <div className="w-1/3">Category</div>
                        <div className="w-1/3">Service Description</div>
                        <div className="w-1/3">Estimated Market Price</div>
                        <div className="size-4" />
                      </div>
                      <div className="flex w-full flex-1 gap-2">
                        <SelectCategory
                          defaultValue={String(d.itemCategoryId)}
                        />
                        <Input
                          name="description"
                          placeholder="Item Description "
                          className="w-1/3 text-xs"
                          defaultValue={d.description}
                        />
                        <div className="relative w-1/3">
                          <Input
                            name="price"
                            className="w-full pl-6 text-xs"
                            defaultValue={d.price}
                          />
                          <PesoInputDecor />
                        </div>
                      </div>
                      <div className="flex justify-end gap-4">
                        <DialogTrigger asChild>
                          <Button
                            size="long"
                            variant={"outlined"}
                            type="button"
                          >
                            Back
                          </Button>
                        </DialogTrigger>
                        <SubmitButton type="submit">SUBMIT</SubmitButton>
                      </div>
                    </EditForm>
                    <ToggleSwitch defaultValue={d.status === 1} id={d.id} />
                  </div>
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
