import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserDetails } from "@/lib/helpers";

export async function RequesterInfo({ userId }: { userId: number }) {
  const { detail, division, location, position, user } =
    await getUserDetails(userId);
  return (
    <div className="rounded-md border border-gray-400">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-gray-400">
            <TableHead
              className="text-center font-bold text-foreground"
              colSpan={4}
            >
              REQUESTER&apos;S INFORMATION
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="w-full">
            <TableCell className="w-1/4 border-gray-400 border-r text-left text-foreground">
              <span className="mr-4 text-muted-foreground">Name: </span>
              {user.name}
            </TableCell>
            <TableCell className="w-1/4 border-gray-400 border-r text-left text-foreground">
              <span className="mr-4 text-muted-foreground">Position: </span>
              {position?.code}
            </TableCell>
            <TableCell className="w-1/4 border-gray-400 border-r text-left text-foreground">
              <span className="mr-4 text-muted-foreground">Division: </span>
              {division?.name}
            </TableCell>
            <TableCell className="w-1/4 text-left text-foreground">
              <span className="mr-4 text-muted-foreground">Branch: </span>
              {location?.code}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
