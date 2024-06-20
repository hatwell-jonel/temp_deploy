import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { Icons } from "@/components/icons";
import { Pagination } from "@/components/pagination";
import Search from "@/components/search";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { supplierSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import { ToggleSwitch } from "./client";
import { getTableData } from "./helpers";

const title = "Supplier Management";
const searchPlaceholder = "Company Name";
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
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard title={title}>
          <Link
            href={"/fims/purchasing/supplier-mgmt/create"}
            className={cn(
              buttonVariants({ size: "long" }),
              "w-full text-xs lg:mr-6 lg:w-fit lg:px-4",
            )}
          >
            <Icons.add className="mr-1 size-4" /> Create Supplier
          </Link>
        </TitleCard>
        <Suspense>
          <Search
            placeholder={searchPlaceholder}
            inputVariable={inputVariable}
          />
        </Suspense>
        <section className="relative max-w-[90vw] xl:max-w-[72vw]">
          <Suspense fallback={<Loading />}>
            <TableData searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function TableData({ searchParams }: PageProps) {
  const parsed = supplierSearchParams.parse(searchParams);
  const { data, meta } = await getTableData({ searchParams: parsed });
  return (
    <>
      <div className="w-full overflow-x-auto rounded-md border-2 bg-background pb-2 shadow-lg">
        <Table className="w-screen text-xs">
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="bg-[#D4D4D4] [&_th]:h-8">
              <TableHead
                className="border-gray-400 border-r text-center text-foreground tracking-widest"
                colSpan={5}
              >
                COMPANY INFORMATION
              </TableHead>
              <TableHead
                className="border-gray-400 border-r text-center text-foreground tracking-widest"
                colSpan={4}
              >
                CONTACT PERSON INFORMATION
              </TableHead>
              <TableHead
                className="border-gray-400 border-r text-center text-foreground tracking-widest"
                colSpan={2}
              >
                CHEQUE DETAILS
              </TableHead>
              <TableHead
                className="border-gray-400 border-r text-center text-foreground tracking-widest"
                colSpan={3}
              >
                ONLINE BANKING
              </TableHead>
              <TableHead className="bg-background text-center text-foreground" />
            </TableRow>
            <TableRow>
              <TableHead className="text-center text-foreground">
                Company Name
              </TableHead>
              <TableHead className="text-center text-foreground">
                Trade Name
              </TableHead>
              <TableHead className="text-center text-foreground">TIN</TableHead>
              <TableHead className="text-center text-foreground">
                Type of Industry
              </TableHead>
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Company Address
              </TableHead>
              <TableHead className="text-center text-foreground">
                Name
              </TableHead>
              <TableHead className="text-center text-foreground">
                Email Address
              </TableHead>
              <TableHead className="text-center text-foreground">
                Mobile Number
              </TableHead>
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Telephone Number
              </TableHead>
              <TableHead className="text-center text-foreground">
                Payee Name
              </TableHead>
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Account Number
              </TableHead>
              <TableHead className="text-center text-foreground">
                Bank
              </TableHead>
              <TableHead className="text-center text-foreground">
                Account Number
              </TableHead>
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Account Name
              </TableHead>
              <TableHead className="text-center text-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow className="odd:bg-[#F9FAFB]">
                <TableHead
                  className="border-gray-400 border-r text-center text-foreground"
                  colSpan={5}
                >
                  No Data
                </TableHead>
                <TableHead
                  className="border-gray-400 border-r text-center text-foreground"
                  colSpan={4}
                >
                  No Data
                </TableHead>
                <TableHead
                  className="border-gray-400 border-r text-center text-foreground"
                  colSpan={2}
                >
                  No Data
                </TableHead>
                <TableHead
                  className="border-gray-400 border-r text-center text-foreground"
                  colSpan={3}
                >
                  No Data
                </TableHead>
                <TableHead className="bg-background text-center text-foreground" />
              </TableRow>
            )}
            {data.map((d, index) => (
              <TableRow key={d.id} className="odd:bg-[#F9FAFB]">
                <TableCell className="text-center font-medium">
                  {d.name}
                </TableCell>
                <TableCell className="text-center">{d.tradeName}</TableCell>
                <TableCell className="text-center">{d.tin}</TableCell>
                <TableCell className="text-center">{d.industry.name}</TableCell>
                <TableCell className="border-gray-400 border-r text-center">
                  {d.address}
                </TableCell>
                <TableCell className="text-center">
                  {d.firstName} {d.middleName ?? ""} {d.lastName}
                </TableCell>
                <TableCell className="text-center">{d.emailAddress}</TableCell>
                <TableCell className="text-center">{d.mobileNumber}</TableCell>
                <TableCell className="border-gray-400 border-r text-center">
                  {d.tel_number ?? "-"}
                </TableCell>
                <TableCell className="text-center">{d.payeeName}</TableCell>
                <TableCell className="border-gray-400 border-r text-center">
                  {d.payeeAccountNumber}
                </TableCell>
                <TableCell className="text-center">{d.bank.name}</TableCell>
                <TableCell className="text-center">
                  {d.bankAccountNumber}
                </TableCell>
                <TableCell className="border-gray-400 border-r text-center">
                  {d.bankAccountName}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/fims/purchasing/supplier-mgmt/update/${d.id}`}
                    >
                      <Icons.edit />
                    </Link>
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
