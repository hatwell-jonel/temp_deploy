"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function ModalDialog({ children }: React.PropsWithChildren) {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();
  React.useEffect(() => {
    if (!open) {
      router.back();
    }
  }, [open, router]);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="max-w-[90vw]">{children}</DialogContent>
    </Dialog>
  );
}
