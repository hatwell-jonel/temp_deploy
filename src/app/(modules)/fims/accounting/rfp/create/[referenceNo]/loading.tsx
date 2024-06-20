import { Icons } from "@/components/icons";

export default function Loading() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <Icons.spinner className="size-8 animate-spin" />
    </div>
  );
}
