import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { getSuppliers } from "../../helpers";
import { Form, TableRowForm } from "./client";

export async function FormTable({ referenceNo }: { referenceNo: string }) {
  const suppliers = await getSuppliers();
  const methodOfDeliveries = await db.query.methodOfDelivery.findMany();
  const paymentOptions = await db.query.paymentOption.findMany();
  const paymentModes = await db.query.paymentMode.findMany();
  const data = await db.query.purchase.findMany({
    where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
    with: {
      itemDescription: true,
    },
  });
  return (
    <Form
      className="space-y-4 rounded-md bg-background p-4 text-xs"
      referenceNo={referenceNo}
    >
      <div className="w-full overflow-x-auto rounded-md border-2 bg-background py-2 shadow-lg">
        <Table className="w-screen text-xs *:whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-foreground">
                Item Description
              </TableHead>
              <TableHead className="text-center text-foreground">
                Quantity
              </TableHead>
              <TableHead className="text-center text-foreground">
                Supplier
              </TableHead>
              <TableHead className="text-center text-foreground">
                Unit Price
              </TableHead>
              <TableHead className="text-center text-foreground">
                Total Price
              </TableHead>
              <TableHead className="text-center text-foreground">
                Delivery Date
              </TableHead>
              <TableHead className="text-center text-foreground">
                Payment Option
              </TableHead>
              <TableHead className="text-center text-foreground">
                Installment Terms
              </TableHead>
              <TableHead className="text-center text-foreground">
                Payment Terms
              </TableHead>
              <TableHead className="text-center text-foreground">
                Payment Mode
              </TableHead>
              <TableHead className="text-center text-foreground">
                Method of Delivery
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Attachments/s</div>
                <div className="text-muted-foreground italic">(Optional)</div>
              </TableHead>
              <TableHead className="text-center text-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, index) => (
              <TableRowForm
                key={d.id}
                rowNumber={index}
                suppliers={suppliers}
                defaultSupplierId={d.preferredSupplierId}
                paymentModes={paymentModes}
                description={d.itemDescription}
                quantity={d.quantity}
                paymentOptions={paymentOptions}
                methodOfDeliveries={methodOfDeliveries}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-4">
        <CancelButton>Cancel</CancelButton>
        <SubmitButton>Submit</SubmitButton>
      </div>
    </Form>
  );
}
