import { cn } from "@/lib/utils";
import Link from "next/link";

const colors = {
  all: "border-[#3A3A3A] text-[#3A3A3A]",
  ci: "border-[#FF0000] text-[#FF0000]",
  vi: "border-[#FF8800] text-[#FF8800]",
  i: "border-[#0D8E09] text-[#0D8E09]",
  li: "border-[#003399] text-[#003399]",
} as const;

const labels = {
  all: "ALL",
  ci: "Critically Important",
  vi: "Very Important",
  i: "Important",
  li: "Less Important",
} as const;

const hrefs = {
  all: "?status=0",
  ci: "?status=1",
  vi: "?status=2",
  i: "?status=3",
  li: "?status=4",
} as const;

export function ImportanceCard({
  type,
  isActive,
  children,
}: {
  type: keyof typeof colors;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const borderColor = colors[type];
  return (
    <Link
      href={hrefs[type]}
      className={cn(
        "flex max-h-12 items-center justify-between gap-4 rounded-md bg-background p-4 text-sm",
        borderColor,
        isActive ? "border-2" : "border",
      )}
    >
      <div className="uppercase">{labels[type]}</div>
      <div className="text-xl">{children}</div>
    </Link>
  );
}
