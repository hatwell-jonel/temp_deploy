import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Suspense } from "react";
import {
  getCarriers,
  getHubs,
  getLeasors,
  getProviders,
  getServiceProviders,
  getSubscriptions,
  getTransportModes,
  getUtilityTypes,
} from "../helpers";
import {
  createAirline,
  createRental,
  createSubscription,
  createUtility,
} from "./action";
import {
  AirlineTableRowForm,
  Form,
  RentalsTableRowForm,
  SelectRentalType,
  SubscriptionTableRowForm,
  UtilitiesTableRowForm,
} from "./client";

export async function AirlineTable() {
  const transportModes = await getTransportModes();
  const carriers = await getCarriers();

  return (
    <Form formAction={createAirline}>
      <div className="rounded-md border border-gray-400 shadow-lg">
        <Table className="text-xs">
          <TableHeader className="*:*:h-8 [&_tr]:border-b-0 *:*:text-center">
            <TableRow>
              <TableHead colSpan={2} className="border-gray-400 border-r" />
              <TableHead
                colSpan={2}
                className="border-gray-400 border-r bg-[#E2E2E2] text-[#777373]"
              >
                Transaction Date
              </TableHead>
              <TableHead colSpan={5} />
            </TableRow>
            <TableRow>
              <TableHead>Transport Mode</TableHead>
              <TableHead className="border-gray-400 border-r">
                Carrier
              </TableHead>
              <TableHead>From</TableHead>
              <TableHead className="border-gray-400 border-r">To</TableHead>
              <TableHead>SOA No.</TableHead>
              <TableHead>MAWB No.</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AirlineTableRowForm
              transportModeItems={transportModes}
              carrierItems={carriers}
            />
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <CancelButton>Cancel</CancelButton>
        <SubmitButton>Submit</SubmitButton>
      </div>
    </Form>
  );
}

export async function UtilitiesTable() {
  const utilityTypes = await getUtilityTypes();
  const serviceProviders = await getServiceProviders();

  return (
    <Form formAction={createUtility}>
      <div className="rounded-md border border-gray-400 shadow-lg">
        <Table className="text-xs">
          <TableHeader className="*:*:h-8 [&_tr]:border-b-0 *:*:text-center">
            <TableRow>
              <TableHead colSpan={2} className="border-gray-400 border-r" />
              <TableHead
                colSpan={2}
                className="border-gray-400 border-r bg-[#E2E2E2] text-[#777373]"
              >
                Transaction Date
              </TableHead>
              <TableHead colSpan={5} />
            </TableRow>
            <TableRow>
              <TableHead>Utility Type</TableHead>
              <TableHead className="border-gray-400 border-r">
                Service Provider
              </TableHead>
              <TableHead>From</TableHead>
              <TableHead className="border-gray-400 border-r">To</TableHead>
              <TableHead>SOA No.</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <UtilitiesTableRowForm
              utilityTypes={utilityTypes}
              serviceProviders={serviceProviders}
            />
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <CancelButton>Cancel</CancelButton>
        <SubmitButton>Submit</SubmitButton>
      </div>
    </Form>
  );
}

export async function RentalsTable({ type }: { type?: number }) {
  const hubs = await getHubs();
  const leasors = await getLeasors();
  return (
    <>
      <div className="flex items-center gap-6 text-sm">
        <Label htmlFor="rentalType">Rental Type: </Label>
        <SelectRentalType
          name="rentalType"
          defaultValue={String(type === 2 ? 2 : 1)}
        >
          <SelectTrigger className="ml-1 w-[150px] text-xs">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Check/Cash</SelectItem>
            <SelectItem value="2">PDC</SelectItem>
          </SelectContent>
        </SelectRentalType>
      </div>
      <Form formAction={createRental}>
        <input type="hidden" name="type" value={type === 2 ? 2 : 1} />
        <div className="rounded-md border border-gray-400 shadow-lg">
          <Table className="text-xs">
            <TableHeader className="*:*:h-8 [&_tr]:border-b-0 *:*:text-center">
              <TableRow>
                <TableHead colSpan={2} className="border-gray-400 border-r" />
                <TableHead
                  colSpan={2}
                  className="border-gray-400 border-r bg-[#E2E2E2] text-[#777373]"
                >
                  Transaction Date
                </TableHead>
                <TableHead colSpan={4} />
              </TableRow>
              <TableRow>
                <TableHead>Hub/Office</TableHead>
                <TableHead className="border-gray-400 border-r">
                  Leasor
                </TableHead>
                <TableHead>From</TableHead>
                <TableHead className="border-gray-400 border-r">
                  To {type === 2 && <span className="italic">(Optional)</span>}
                </TableHead>
                <TableHead>
                  Terms{" "}
                  {type === 1 && <span className="italic">(Optional)</span>}
                </TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Suspense>
                <RentalsTableRowForm
                  leasors={leasors}
                  hubs={hubs}
                  type={type === 2 ? 2 : 1}
                />
              </Suspense>
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end gap-4">
          <CancelButton>Cancel</CancelButton>
          <SubmitButton>Submit</SubmitButton>
        </div>
      </Form>
    </>
  );
}

export async function SubscriptionTable() {
  const subscriptions = await getSubscriptions();
  const providers = await getProviders();

  return (
    <Form formAction={createSubscription}>
      <div className="rounded-md border border-gray-400 shadow-lg">
        <Table className="text-xs">
          <TableHeader className="*:*:h-8 [&_tr]:border-b-0 *:*:text-center">
            <TableRow>
              <TableHead colSpan={2} className="border-gray-400 border-r" />
              <TableHead
                colSpan={2}
                className="border-gray-400 border-r bg-[#E2E2E2] text-[#777373]"
              >
                Transaction Date
              </TableHead>
              <TableHead colSpan={5} />
            </TableRow>
            <TableRow>
              <TableHead>Subscription</TableHead>
              <TableHead className="border-gray-400 border-r">
                Provider
              </TableHead>
              <TableHead>From</TableHead>
              <TableHead className="border-gray-400 border-r">To</TableHead>
              <TableHead>SOA No.</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SubscriptionTableRowForm
              providers={providers}
              subscriptions={subscriptions}
            />
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <CancelButton>Cancel</CancelButton>
        <SubmitButton>Submit</SubmitButton>
      </div>
    </Form>
  );
}
