import { Bullet } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

type Status = {
  value: number;
  label: "Approved" | "Pending" | "Declined" | "Reviewed";
  twColor: string;
};

export const statuses: Status[] = [
  {
    value: 1,
    label: "Approved",
    twColor: "#039",
  },
  {
    value: 0,
    label: "Pending",
    twColor: "#FF8800",
  },
  {
    value: 2,
    label: "Declined",
    twColor: "#FF0000",
  },
  {
    value: 3,
    label: "Reviewed",
    twColor: "#167F39",
  },
];

export function Status({ status }: { status: number | null }) {
  if (status === null) return null;
  const foundStatus = statuses.find((s) => s.value === status);
  return (
    <div className="flex w-full items-center justify-center">
      <Bullet
        style={{ backgroundColor: foundStatus?.twColor ?? "black" }}
        className="flex-grow-0"
      />
      <span style={{ color: foundStatus?.twColor ?? "black" }}>
        {foundStatus?.label}
      </span>
    </div>
  );
}

const prioritiess = [
  "critically-important",
  "very-important",
  "important",
  "less-important",
] as const;

// important: "bg-[#167F39]/10 text-[#167F39]",
// "critically-important": "bg-[#E80000]/10 text-[#E80000]",
// "very-important": "bg-[#FFB900]/10 text-[#FFB900]",
// "less-important": "bg-[#003399]/10 text-[#003399]",

const textColors = [
  "text-[#E80000]",
  "text-[#FFB900]",
  "text-[#167F39]",
  "text-[#003399]",
] as const;

export function getColorOfPriority(priority: number) {
  return textColors[priority - 1];
}

export function Priority({ priority }: { priority: number }) {
  return (
    <Badge
      variant={prioritiess[priority - 1]}
      className="whitespace-nowrap capitalize"
    >
      {prioritiess[priority - 1].replaceAll("-", " ")}
    </Badge>
  );
}
