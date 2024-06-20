import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BudgetDetails({
  budgetSource,
  opexCategory,
  coa,
  opexType,
  subAccount,
}: {
  budgetSource: string;
  opexCategory: string;
  opexType: string;
  coa: string;
  subAccount: string;
}) {
  return (
    <div className="rounded-md border border-gray-400">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-gray-400">
            <TableHead
              className="text-center font-bold text-foreground"
              colSpan={5}
            >
              BUDGET DETAILS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="w-full">
            <TableCell className="w-1/5 border-gray-400 border-r text-left text-foreground">
              <div className="flex gap-2">
                <div className="text-muted-foreground">Budget Source: </div>
                <div>{budgetSource}</div>
              </div>
            </TableCell>
            <TableCell className="w-1/5 border-gray-400 border-r text-left text-foreground">
              <div className="flex gap-2">
                <div className="text-muted-foreground">OpEx Category: </div>
                <div>{opexCategory}</div>
              </div>
            </TableCell>
            <TableCell className="w-1/5 border-gray-400 border-r text-left text-foreground">
              <div className="flex gap-2">
                <div className="text-muted-foreground">OpEx Type: </div>
                <div>{opexType}</div>
              </div>
            </TableCell>
            <TableCell className="w-1/5 border-gray-400 border-r text-left text-foreground">
              <div className="flex gap-2">
                <div className="text-muted-foreground">COA: </div>
                <div>{coa}</div>
              </div>
            </TableCell>
            <TableCell className="w-1/5 text-left text-foreground">
              <div className="flex gap-2">
                <div className="text-muted-foreground">Sub Account: </div>
                <div>{subAccount}</div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
