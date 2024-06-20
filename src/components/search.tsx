"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

interface SearchProps {
  placeholder: string;
  inputVariable: string;
}

export default function Search({ placeholder, inputVariable }: SearchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState(searchParams.get(inputVariable) ?? "");
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
        newSearchParams.delete("page");
      }
      return newSearchParams.toString();
    },
    [searchParams],
  );

  return (
    <>
      <div className="flex gap-6">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="w-[12rem] border-gray-900 border-b bg-transparent text-sm focus:border-capex focus:text-capex focus:outline-none"
        />
        <Button
          size={"sm"}
          className="h-8 rounded-sm px-8 py-0.5 text-xs"
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              router.push(
                `${pathname}?${createQueryString({ [inputVariable]: input })}`,
              );
            })
          }
        >
          {isPending && (
            <Icons.spinner className="mr-2 inline-flex h-4 w-4 animate-spin" />
          )}
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>
    </>
  );
}
