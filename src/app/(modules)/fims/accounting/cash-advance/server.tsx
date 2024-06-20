import { Button } from "@/components/ui/button";
import * as D from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import * as S from "@/components/ui/select";
import { redirect } from "next/navigation";
import { SubmitButton } from "./client";
import { getCATypes } from "./helpers";

export async function CreateDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const caTypes = await getCATypes();
  return (
    <D.Dialog>
      <D.DialogTrigger asChild>{children}</D.DialogTrigger>
      <D.DialogContent className="max-w-sm p-0">
        <div className="space-y-4 px-4 py-2.5">
          <div className="font-semibold text-lg text-primary">Cash Advance</div>
          <form
            className="space-y-4"
            action={async (formData: FormData) => {
              "use server";
              const category = formData.get("category") as string;
              redirect(
                `/fims/accounting/cash-advance/create?category=${category}`,
              );
            }}
          >
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap" htmlFor="category">
                Type of Request:
              </Label>
              <S.Select name="category">
                <S.SelectTrigger className="text-xs">
                  <S.SelectValue placeholder="Select" />
                </S.SelectTrigger>
                <S.SelectContent>
                  {caTypes.map((item) => (
                    <S.SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </S.SelectItem>
                  ))}
                </S.SelectContent>
              </S.Select>
            </div>
            <div className="flex justify-end gap-2">
              <D.DialogTrigger asChild>
                <Button variant="outlined" size="long">
                  Cancel
                </Button>
              </D.DialogTrigger>
              <SubmitButton size="long" type="submit">
                OK
              </SubmitButton>
            </div>
          </form>
        </div>
      </D.DialogContent>
    </D.Dialog>
  );
}
