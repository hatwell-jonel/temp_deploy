"use client";
import { Textarea } from "@/components/ui/textarea";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import type { FormPropsWithReference } from "@/types";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { approveJO, approvePO, declineJO, declinePO } from "./action";

interface PrintViewWrapper extends React.PropsWithChildren {
  printOnMount: boolean;
}

export function PrintViewWrapper({ printOnMount, children }: PrintViewWrapper) {
  const mounted = useMounted();
  if (mounted && printOnMount === true) {
    window.print();
  }

  return <>{children}</>;
}

export function NotesInput() {
  const [text, setText] = React.useState("");
  return (
    <>
      <div className="space-y-2">
        <div>
          <span
            className={cn(
              "font-semibold text-md",
              text.length < 1 && "print:hidden",
            )}
          >
            {"NOTES "}
          </span>
          <span className="inline-flex text-muted-foreground print:hidden">
            (Optional)
          </span>
        </div>
        <div>
          <Textarea
            onChange={(v) => setText(v.currentTarget.value)}
            value={text}
            className="block border-gray-400 print:hidden"
          />
          <div className="hidden print:block">{text.toString()}</div>
        </div>
      </div>
    </>
  );
}

interface FormProps extends FormPropsWithReference {
  type: "jo" | "po";
}

export function ApproveForm({
  children,
  referenceNo,
  type,
  ...props
}: FormProps) {
  const router = useRouter();
  const formAction =
    type === "jo"
      ? approveJO.bind(null, referenceNo)
      : approvePO.bind(null, referenceNo);

  const [state, action] = useFormState(formAction, {
    message: undefined,
    success: undefined,
  });
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
      router.push("/fims/purchasing/job-purchase-order");
    }
  }, [state, router]);
  return (
    <form
      {...props}
      action={action}
      key={state.success === true ? Math.random() : "static"}
    >
      {children}
    </form>
  );
}

export function DeclineForm({
  children,
  referenceNo,
  type,
  ...props
}: FormProps) {
  const formAction =
    type === "jo"
      ? declineJO.bind(null, referenceNo)
      : declinePO.bind(null, referenceNo);

  const [state, action] = useFormState(formAction, {
    message: undefined,
    success: undefined,
  });
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
    }
  }, [state]);
  return (
    <form
      {...props}
      action={action}
      key={state.success === true ? Math.random() : "static"}
    >
      {children}
    </form>
  );
}
