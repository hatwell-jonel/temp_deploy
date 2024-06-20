import { SubmitButton } from "@/components/buttons/submit";
import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/db";
import { supplierCreateSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import {
  getBarangays,
  getCities,
  getIndustries,
  getRegions,
} from "../../helpers";
import { Form } from "./client";
import { SelectWithRouter } from "./client";

const title = "Edit Supplier Form";

export const metadata = {
  title,
};

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
  params: { id: string };
};

export default function Page({ params, searchParams }: PageProps) {
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/purchasing/supplier-mgmt"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              {title}
            </>
          }
        />
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <Suspense fallback={<Loading />}>
            <CreateForm searchParams={searchParams} params={params} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function CreateForm({ searchParams, params }: PageProps) {
  const { cityId, regionId } = supplierCreateSearchParams.parse(searchParams);
  const defaultValue = await db.query.supplier.findFirst({
    where: (table, { eq }) => eq(table.id, Number(params.id)),
  });
  if (!defaultValue) return <p>Supplier details not found!</p>;
  const regions = await getRegions();
  const cities = await getCities(regionId || Number(defaultValue.regionId));
  const industries = await getIndustries();
  const barangays = await getBarangays(cityId || Number(defaultValue.cityId));
  const banks = await db.query.bank.findMany();

  return (
    <Form
      className="w-full rounded-md bg-background shadow-md"
      supplierId={defaultValue?.id}
    >
      <div className="rounded-t-md bg-primary px-6 py-1 text-background">
        Company Information
      </div>
      <div className="space-y-2 px-6 py-1 text-primary">
        <div>
          <Label htmlFor="name">Company Name</Label>
          <Input name="name" defaultValue={defaultValue?.name} />
        </div>
        <div>
          <Label htmlFor="tradeName">Trade Name</Label>
          <Input name="tradeName" defaultValue={defaultValue?.tradeName} />
        </div>
        <div className="flex w-full gap-2">
          <div className="w-1/2">
            <Label htmlFor="tin">TIN</Label>
            <Input name="tin" defaultValue={defaultValue?.tin} />
          </div>
          <div className="w-1/2">
            <Label htmlFor="industryId">Industry</Label>
            <Select
              name="industryId"
              defaultValue={String(defaultValue?.industryId)}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((item) => (
                  <SelectItem value={String(item.id)} key={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-foreground">Company Address</div>
        <div className="flex w-full gap-2">
          <div className="w-1/2">
            <Label htmlFor="regionId">Region</Label>
            <SelectWithRouter
              queryKey="regionId"
              name="regionId"
              defaultValue={String(defaultValue?.regionId)}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((item) => (
                  <SelectItem value={String(item.id)} key={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectWithRouter>
          </div>
          <div className="w-1/2">
            <Label htmlFor="cityId">Province/City</Label>
            <SelectWithRouter
              queryKey="cityId"
              name="cityId"
              defaultValue={String(defaultValue?.cityId)}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Province/City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((item) => (
                  <SelectItem value={String(item.id)} key={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectWithRouter>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <div className="w-1/2">
            <Label htmlFor="barangayId">Barangay</Label>
            <Select
              name="barangayId"
              defaultValue={String(defaultValue?.barangayId)}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Barangay" />
              </SelectTrigger>
              <SelectContent>
                {barangays.map((item) => (
                  <SelectItem value={String(item.id)} key={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              name="postalCode"
              type="number"
              defaultValue={String(defaultValue?.postalCode)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Street name, Building/House Number</Label>
          <Input name="address" defaultValue={defaultValue?.address} />
        </div>
      </div>
      <div className="mt-2 bg-primary px-6 py-1 text-background">
        Contact Person Information
      </div>
      <div className="space-y-2 px-6 py-1 text-primary">
        <div className="flex w-full gap-2">
          <div className="w-1/3">
            <Label htmlFor="firstName">First Name</Label>
            <Input name="firstName" defaultValue={defaultValue?.firstName} />
          </div>
          <div className="w-1/3">
            <Label htmlFor="middleName">
              Middle Name{" "}
              <span className="text-foreground italic">(Optional)</span>
            </Label>
            <Input
              name="middleName"
              defaultValue={defaultValue?.middleName ?? undefined}
            />
          </div>
          <div className="w-1/3">
            <Label htmlFor="lastName">Last Name</Label>
            <Input name="lastName" defaultValue={defaultValue?.lastName} />
          </div>
        </div>
        <div>
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input
            name="emailAddress"
            type="email"
            defaultValue={defaultValue?.emailAddress}
          />
        </div>
        <div className="flex w-full gap-2">
          <div className="w-1/2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              name="mobileNumber"
              defaultValue={defaultValue?.mobileNumber}
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="telephoneNumber">
              Telephone Number{" "}
              <span className="text-foreground italic">(Optional)</span>
            </Label>
            <Input
              name="telephoneNumber"
              defaultValue={defaultValue?.tel_number ?? undefined}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 bg-primary px-6 py-1 text-background">
        Contact Person Information
      </div>
      <div className="space-y-2 px-6 py-1 text-primary">
        <div className="text-foreground">Cheque Details</div>
        <div className="flex w-full gap-2">
          <div className="w-1/2">
            <Label htmlFor="payeeName">Name of Payee</Label>
            <Input name="payeeName" defaultValue={defaultValue?.payeeName} />
          </div>
          <div className="w-1/2">
            <Label htmlFor="payeeAccountNumber">Account Number</Label>
            <Input
              name="payeeAccountNumber"
              defaultValue={defaultValue?.payeeAccountNumber}
            />
          </div>
        </div>
        <div className="text-foreground">Online Banking</div>
        <div className="flex w-full gap-2">
          <div className="w-1/2">
            <Label htmlFor="bankId">Bank</Label>
            <Select name="bankId" defaultValue={String(defaultValue?.bankId)}>
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((item) => (
                  <SelectItem value={String(item.id)} key={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <Label htmlFor="bankAccountNumber">Account Number</Label>
            <Input
              name="bankAccountNumber"
              defaultValue={defaultValue?.bankAccountNumber}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="bankAccountName">Account Name</Label>
          <Input
            name="bankAccountName"
            defaultValue={defaultValue?.bankAccountName}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2 px-6 pb-6">
        <SubmitButton>OK</SubmitButton>
      </div>
    </Form>
  );
}
