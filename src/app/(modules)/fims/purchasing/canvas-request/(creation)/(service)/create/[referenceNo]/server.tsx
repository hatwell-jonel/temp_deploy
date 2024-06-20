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
import { getPreferredWorkers } from "../../helpers";
import { Form, TableRowForm } from "./client";

export async function FormTable({ referenceNo }: { referenceNo: string }) {
  const preferredWorkers = await getPreferredWorkers();
  const data = await db.query.serviceRequisition.findMany({
    where: (r, { eq }) => eq(r.requisitionNo, referenceNo),
    with: {
      serviceDescription: true,
    },
  });

  return (
    <Form
      className="space-y-4 rounded-md bg-background p-4 text-xs"
      referenceNo={referenceNo}
    >
      <div className="w-full overflow-x-auto rounded-md border-2 bg-background py-2 shadow-lg">
        <Table className="w-screen text-xs">
          <TableHeader>
            <TableRow className="*:whitespace-nowrap *:text-center *:text-foreground">
              <TableHead>Service Description</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>hr/s</TableHead>
              <TableHead>Extent of Work</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Total Rate</TableHead>
              <TableHead>
                <div>Attachments/s</div>
                <div className="text-muted-foreground italic">(Optional)</div>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRowForm
                key={d.id}
                preferredWorkers={preferredWorkers}
                description={d.serviceDescription}
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
