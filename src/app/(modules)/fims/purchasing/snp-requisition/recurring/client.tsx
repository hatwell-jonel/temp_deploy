"use client";

import { Dialog } from "@/components/ui/dialog";
import { DialogContext, useDialog } from "@/hooks/use-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CategoryForm({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { setOpen } = useDialog();
  return (
    <form
      action={(formData: FormData) => {
        const category = formData.get("category") as string;
        router.push(
          `/fims/purchasing/snp-requisition/recurring/create?apCategory=${category}`,
        );
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </form>
  );
}

export function DialogProvider({ children }: React.PropsWithChildren) {
  const [open, setOpen] = useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </DialogContext.Provider>
  );
}
