import { SubmitButton } from "@/components/buttons/submit";
import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { Icons } from "@/components/icons";
import { Pagination } from "@/components/pagination";
import Search from "@/components/search";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { manpower } from "@/db/schema/fims";
import { cn } from "@/lib/utils";
import { manpowerSearchParams } from "@/validations/searchParams";
import { Suspense } from "react";
import { DialogForm, EditForm, Form, ToggleSwitch } from "./client";
import { getTableData } from "./helpers";

const title = "Manpower Management";
const searchPlaceholder = "Worker's Name";
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
          <CreateDialog />
        </TitleCard>
        <Suspense>
          <Search
            placeholder={searchPlaceholder}
            inputVariable={inputVariable}
          />
        </Suspense>
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <Suspense fallback={<Loading />}>
            <TableData searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

function EditDialog({
  defaultValue,
}: {
  defaultValue: typeof manpower.$inferSelect;
}) {
  return (
    <DialogForm>
      <DialogTrigger>
        <Icons.edit />
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="font-bold text-lg">
          Worker&apos;s Information
        </DialogHeader>
        <EditForm className="space-y-2" tableId={defaultValue.id}>
          <div className="flex w-full gap-2">
            <div className="w-1/3">
              <Label htmlFor="firstName" className="text-primary text-xs">
                First Name
              </Label>
              <Input name="firstName" defaultValue={defaultValue.firstName} />
            </div>
            <div className="w-1/3">
              <Label htmlFor="middleName" className="text-primary text-xs">
                Middle Name{" "}
                <span className="text-black italic">(Optional)</span>
              </Label>
              <Input
                name="middleName"
                defaultValue={defaultValue.middleName ?? undefined}
              />
            </div>
            <div className="w-1/3">
              <Label htmlFor="lastName" className="text-primary text-xs">
                Last Name
              </Label>
              <Input name="lastName" defaultValue={defaultValue.lastName} />
            </div>
          </div>
          <div>
            <Label htmlFor="emailAddress" className="text-primary text-xs">
              Email Address:
            </Label>
            <Input
              name="emailAddress"
              type="email"
              defaultValue={defaultValue.emailAddress}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label htmlFor="mobileNumber" className="text-primary text-xs">
                Phone Number:
              </Label>
              <Input
                name="mobileNumber"
                defaultValue={defaultValue.mobileNumber}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="telephoneNumber" className="text-primary text-xs">
                Telephone Number:
                <span className="text-black italic">(Optional)</span>
              </Label>
              <Input
                name="telephoneNumber"
                type="tel"
                defaultValue={defaultValue.telephoneNumber ?? undefined}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label htmlFor="agency" className="text-primary text-xs">
                Company/Agency:
              </Label>
              <Input name="agency" defaultValue={defaultValue.agency} />
            </div>
            <div className="w-1/2">
              <Label htmlFor="tin" className="text-primary text-xs">
                TIN Number:
              </Label>
              <Input name="tin" defaultValue={defaultValue.tin} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <DialogTrigger asChild>
              <Button variant={"outlined"} size={"long"} type="button">
                Cancel
              </Button>
            </DialogTrigger>
            <SubmitButton size={"long"}>OK</SubmitButton>
          </div>
        </EditForm>
      </DialogContent>
    </DialogForm>
  );
}

function CreateDialog() {
  return (
    <DialogForm>
      <DialogTrigger
        className={cn(
          buttonVariants({ size: "long" }),
          "w-full text-xs lg:mr-6 lg:w-fit lg:px-4",
        )}
      >
        <Icons.add className="mr-1 size-4" /> Register Manpower
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="font-bold text-lg">
          Worker&apos;s Information
        </DialogHeader>
        <Form className="space-y-2">
          <div className="flex w-full gap-2">
            <div className="w-1/3">
              <Label htmlFor="firstName" className="text-primary text-xs">
                First Name
              </Label>
              <Input name="firstName" />
            </div>
            <div className="w-1/3">
              <Label htmlFor="middleName" className="text-primary text-xs">
                Middle Name{" "}
                <span className="text-black italic">(Optional)</span>
              </Label>
              <Input name="middleName" />
            </div>
            <div className="w-1/3">
              <Label htmlFor="lastName" className="text-primary text-xs">
                Last Name
              </Label>
              <Input name="lastName" />
            </div>
          </div>
          <div>
            <Label htmlFor="emailAddress" className="text-primary text-xs">
              Email Address:
            </Label>
            <Input name="emailAddress" type="email" />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label htmlFor="mobileNumber" className="text-primary text-xs">
                Phone Number:
              </Label>
              <Input name="mobileNumber" />
            </div>
            <div className="w-1/2">
              <Label htmlFor="telephoneNumber" className="text-primary text-xs">
                Telephone Number:
                <span className="text-black italic">(Optional)</span>
              </Label>
              <Input name="telephoneNumber" type="tel" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label htmlFor="agency" className="text-primary text-xs">
                Company/Agency:
              </Label>
              <Input name="agency" />
            </div>
            <div className="w-1/2">
              <Label htmlFor="tin" className="text-primary text-xs">
                TIN Number:
              </Label>
              <Input name="tin" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <DialogTrigger asChild>
              <Button variant={"outlined"} size={"long"} type="button">
                Cancel
              </Button>
            </DialogTrigger>
            <SubmitButton size={"long"}>OK</SubmitButton>
          </div>
        </Form>
      </DialogContent>
    </DialogForm>
  );
}

async function TableData({ searchParams }: PageProps) {
  const parsed = manpowerSearchParams.parse(searchParams);
  const { data, meta } = await getTableData({ searchParams: parsed });
  return (
    <>
      <div className="w-full overflow-x-auto rounded-md border-2 bg-background py-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-foreground">
                Worker&apos;s Name
              </TableHead>
              <TableHead className="text-center text-foreground">
                Email Address
              </TableHead>
              <TableHead className="text-center text-foreground">
                Mobile Number
              </TableHead>
              <TableHead className="text-center text-foreground">
                Telephone Number
              </TableHead>
              <TableHead className="text-center text-foreground">
                Company/Agency
              </TableHead>
              <TableHead className="text-center text-foreground">
                TIN Number
              </TableHead>
              <TableHead className="text-center text-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, index) => (
              <TableRow key={d.id} className="odd:bg-[#F9FAFB]">
                <TableCell className="text-center font-medium">
                  {d.firstName} {d.middleName ? `${d.middleName} ` : ""}
                  {d.lastName}
                </TableCell>
                <TableCell className="text-center">{d.emailAddress}</TableCell>
                <TableCell className="text-center">{d.mobileNumber}</TableCell>
                <TableCell className="text-center">
                  {d.telephoneNumber && d.telephoneNumber.length > 0
                    ? d.telephoneNumber
                    : "-"}
                </TableCell>
                <TableCell className="text-center">{d.agency}</TableCell>
                <TableCell className="text-center">{d.tin}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <EditDialog defaultValue={d} />
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
