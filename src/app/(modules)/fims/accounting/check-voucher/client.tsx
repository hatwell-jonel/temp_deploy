"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { approve, create, decline, review, search } from "./actions";

export function SearchForm({
  children,
}: React.ComponentPropsWithoutRef<"form">) {
  // const searchParams = useSearchParams();
  const [state, dispatch] = useFormState(search, {
    message: undefined,
    success: undefined,
  });

  return (
    <>
      <form className="-mt-2 flex flex-wrap items-end gap-6" action={dispatch}>
        {children}
      </form>
    </>
  );
}

type FormValues = {
  detail: {
    orNumber: string[];
  }[];
};

export function MultipleInputOR() {
  const { control } = useForm<FormValues>({
    defaultValues: {
      detail: [
        {
          orNumber: [""],
        },
      ],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "detail", // unique name for your Field Array
  });
  return (
    <div className="flex flex-col gap-1">
      {fields.map((_, index) => {
        const isLast = index + 1 === fields.length;
        return (
          <div className="flex items-center gap-2" key={index}>
            <Input name="orNumber" className="h-4 border-primary" />
            {fields.length > 1 && (
              <Button
                type="button"
                size={"icon"}
                variant={"destructive"}
                className="size-4 rounded-full p-1 print:hidden"
                onClick={() => remove(index)}
              >
                <Icons.subtract />
              </Button>
            )}
            {!!isLast && (
              <Button
                type="button"
                size={"icon"}
                className="size-4 rounded-full p-1 print:hidden"
                onClick={() => append({ orNumber: [""] })}
              >
                <Icons.add />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface FormProps extends React.ComponentPropsWithoutRef<"form"> {
  actionType: "create" | "approve" | "decline" | "review";
}

const formActionMap = {
  create: create,
  approve: approve,
  decline: decline,
  review: review,
} as const;

export function Form({ children, actionType, ...props }: FormProps) {
  const [state, dispatch] = useFormState(formActionMap[actionType], {
    message: undefined,
    success: undefined,
  });
  const router = useRouter();

  React.useEffect(() => {
    if (state.success === true) {
      toast.success(state.message);
      router.push("/fims/accounting/check-voucher");
    } else if (state.success === false) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <>
      <form {...props} action={dispatch}>
        {children}
      </form>
    </>
  );
}
