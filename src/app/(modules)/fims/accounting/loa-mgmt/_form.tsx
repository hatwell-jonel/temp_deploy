import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import PesoInputDecor from "@/components/peso-input-decor";
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
import { db } from "@/db";
import { loaUpdateSearchParams } from "@/validations/searchParams";
import { Suspense } from "react";
import { EditForm, Form, RowWrapper, SelectSubModule } from "./client";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function CreateForm({ searchParams }: PageProps) {
  const subModuleId = searchParams.subModuleId
    ? searchParams.subModuleId.toString()
    : "";

  return (
    <Form className="space-y-4">
      <div className="flex items-center gap-2">
        Sub-Module:{" "}
        <Suspense>
          <SelectSubModule name={"subModule"}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Sub-Module" />
            </SelectTrigger>
            <SelectContent>
              <Suspense>
                <SubModules />
              </Suspense>
            </SelectContent>
          </SelectSubModule>
        </Suspense>
      </div>
      <div className="rounded-md border border-gray-400 bg-background pb-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader className="[&_tr]:border-b-1">
            <TableRow className="[&_th]:h-8">
              <TableHead className="border-gray-400 border-r" />
              <TableHead className="border-gray-400 border-r" />
              <TableHead
                colSpan={2}
                className="border-gray-400 border-r bg-[#E2E2E2]"
              >
                <div className="flex items-center justify-center">
                  Budget Range
                </div>
              </TableHead>
              <TableHead />
            </TableRow>
            <TableRow className="border-gray-400 border-b [&_th]:h-10">
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Division
              </TableHead>
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Level
              </TableHead>
              <TableHead className="text-center text-foreground">
                Minimum
              </TableHead>
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Maximum
              </TableHead>
              {!["3", "4"].includes(subModuleId) && (
                <>
                  <TableHead className="text-center text-foreground">
                    Reviewer 1
                  </TableHead>
                  <TableHead className="text-center text-foreground">
                    <div>Reviewer 2</div>
                    <i>(optional)</i>
                  </TableHead>
                </>
              )}
              <TableHead className="text-center text-foreground">
                Approver 1
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Approver 2</div>
                <i>(optional)</i>
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Approver 3</div>
                <i>(optional)</i>
              </TableHead>
              <TableHead className="text-center text-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <Suspense>
            <Body />
          </Suspense>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <CancelButton type="button" />
        <SubmitButton>Submit</SubmitButton>
      </div>
    </Form>
  );
}

async function Body() {
  const divisions = await db.query.budgetSource.findMany({
    where: (table, { eq }) => eq(table.status, 1),
  });
  const userList = await db.query.users.findMany();
  return (
    <TableBody>
      <RowWrapper divisionItems={divisions} userItems={userList} />
    </TableBody>
  );
}

async function SubModules() {
  const subModules = await db.query.subModule.findMany();
  return (
    <>
      {subModules.map((item) => (
        <SelectItem value={String(item.id)} key={item.id}>
          {item.name}
        </SelectItem>
      ))}
    </>
  );
}

export async function UpdateForm({ searchParams }: PageProps) {
  const parse = loaUpdateSearchParams.safeParse(searchParams);
  if (!parse.success)
    return <p>Cannot update from given details! Try again.</p>;
  const { divisionId, subModuleId, selectedDivision } = parse.data;
  const divisions = await db.query.budgetSource.findMany({
    where: (table, { eq }) => eq(table.status, 1),
  });
  const userList = await db.query.users.findMany();
  const details = await db.query.loaManagement.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.divisionId, divisionId), eq(table.subModuleId, subModuleId)),
  });

  return (
    <EditForm className="space-y-4" binded={{ divisionId, subModuleId }}>
      <div className="flex items-center gap-2">
        Sub-Module:{" "}
        <Suspense>
          <SelectSubModule
            name={"subModule"}
            defaultValue={String(subModuleId)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Sub-Module" />
            </SelectTrigger>
            <SelectContent>
              <Suspense>
                <SubModules />
              </Suspense>
            </SelectContent>
          </SelectSubModule>
        </Suspense>
      </div>
      <div className="rounded-md border border-gray-400 bg-background pb-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader className="[&_tr]:border-b-1">
            <TableRow className="[&_th]:h-8">
              <TableHead className="border-gray-400 border-r" />
              <TableHead className="border-gray-400 border-r" />
              <TableHead
                colSpan={2}
                className="border-gray-400 border-r bg-[#E2E2E2]"
              >
                <div className="flex items-center justify-center">
                  Budget Range
                </div>
              </TableHead>
              <TableHead />
            </TableRow>
            <TableRow className="border-gray-400 border-b [&_th]:h-10">
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Division
              </TableHead>
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Level
              </TableHead>
              <TableHead className="text-center text-foreground">
                Minimum
              </TableHead>
              <TableHead className="border-gray-400 border-r text-center text-foreground">
                Maximum
              </TableHead>
              {![3, 4].includes(subModuleId) && (
                <>
                  <TableHead className="text-center text-foreground">
                    Reviewer1
                  </TableHead>
                  <TableHead className="text-center text-foreground">
                    <div>Reviewer 2</div>
                    <i>(optional)</i>
                  </TableHead>
                </>
              )}
              <TableHead className="text-center text-foreground">
                Approver 1
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Approver 2</div>
                <i>(optional)</i>
              </TableHead>
              <TableHead className="text-center text-foreground">
                <div>Approver 3</div>
                <i>(optional)</i>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((v, idx) => {
              const value = idx;
              return (
                <TableRow key={`${value}.${selectedDivision}`}>
                  {idx === 0 && (
                    <TableCell className="border-gray-400 border-r" rowSpan={3}>
                      <Select
                        defaultValue={String(v.divisionId)}
                        name={`detail.${value}.divisionId`}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Division" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map((item) => (
                            <SelectItem value={String(item.id)} key={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        name={"detail.1.divisionId"}
                        defaultValue={String(v.divisionId)}
                        type="hidden"
                      />
                      <input
                        name={"detail.2.divisionId"}
                        defaultValue={String(v.divisionId)}
                        type="hidden"
                      />
                    </TableCell>
                  )}
                  <TableCell className="border-gray-400 border-r text-center">
                    {idx + 1}
                    <input
                      type="hidden"
                      name={`detail.${value}.level`}
                      value={idx + 1}
                    />
                  </TableCell>
                  <TableCell className="px-2 text-center">
                    <div className="relative">
                      <Input
                        className="px-6"
                        name={`detail.${value}.minimumBudget`}
                        defaultValue={v.minAmount}
                      />
                      <PesoInputDecor />
                    </div>
                  </TableCell>
                  <TableCell className="border-gray-400 border-r px-2 text-center">
                    <div className="relative">
                      <Input
                        className="px-6"
                        name={`detail.${value}.maximumBudget`}
                        defaultValue={v.maxAmount}
                      />
                      <PesoInputDecor />
                    </div>
                  </TableCell>
                  {![3, 4].includes(subModuleId) && (
                    <>
                      <TableCell className="text-center">
                        <Select
                          name={`detail.${value}.reviewerId`}
                          defaultValue={
                            v.reviewer1Id ? String(v.reviewer1Id) : undefined
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Reviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"0"}>Clear Select</SelectItem>
                            {userList.map((item) => (
                              <SelectItem value={String(item.id)} key={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <Select
                          name={`detail.${value}.reviewer2Id`}
                          defaultValue={
                            v.reviewer2Id ? String(v.reviewer2Id) : undefined
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Reviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"0"}>Clear Select</SelectItem>
                            {userList.map((item) => (
                              <SelectItem value={String(item.id)} key={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-center">
                    <Select
                      name={`detail.${value}.approver1Id`}
                      defaultValue={
                        v.approver1Id ? String(v.approver1Id) : undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Approver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"0"}>Clear Select</SelectItem>
                        {userList.map((item) => (
                          <SelectItem value={String(item.id)} key={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <Select
                      name={`detail.${value}.approver2Id`}
                      defaultValue={
                        v.approver2Id ? String(v.approver2Id) : undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Approver 2" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"0"}>Clear Select</SelectItem>
                        {userList.map((item) => (
                          <SelectItem value={String(item.id)} key={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <Select
                      name={`detail.${value}.approver3Id`}
                      defaultValue={
                        v.approver3Id ? String(v.approver3Id) : undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Approver 3" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"0"}>Clear Select</SelectItem>
                        {userList.map((item) => (
                          <SelectItem value={String(item.id)} key={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <CancelButton type="button" />
        <SubmitButton>Submit</SubmitButton>
      </div>
    </EditForm>
  );
}
