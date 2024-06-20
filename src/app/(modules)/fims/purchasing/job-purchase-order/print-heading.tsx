import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";

export function PrintHeading({ title }: { title: string }) {
  return (
    <>
      <Table className="table-fixed border border-foreground text-xs [font-size:10px]">
        <TableBody className="*:w-full *:*:border-foreground *:*:border-r *:*:border-b">
          <TableRow>
            <TableCell rowSpan={3} className="w-1/3">
              <div>
                <Image
                  alt="capex-logo"
                  src="/images/capex-logo.png"
                  width={127}
                  height={70}
                />
                Bldg. 9A, Salem International Commercial Complex, Domestic Road,
                Pasay City
              </div>
            </TableCell>
            <TableCell
              colSpan={6}
              className="py-2 text-center font-semibold text-base"
            >
              {title}
            </TableCell>
          </TableRow>
          <TableRow className="font-extralight">
            <TableCell className="bg-[#E6E6E6] py-2">Form No.:</TableCell>
            <TableCell colSpan={2} className="py-2" />
            <TableCell className="bg-[#E6E6E6] py-2">Date Issued:</TableCell>
            <TableCell colSpan={2} className="py-2" />
          </TableRow>
          <TableRow className="font-extralight">
            <TableCell className="bg-[#E6E6E6] py-2">Revision No.:</TableCell>
            <TableCell colSpan={2} className="py-2" />
            <TableCell className="bg-[#E6E6E6] py-2">
              Effectivity Date:
            </TableCell>
            <TableCell colSpan={2} className="py-2" />
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
