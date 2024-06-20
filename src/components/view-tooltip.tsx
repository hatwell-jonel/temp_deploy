import * as T from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function ViewTooltip({ children }: { children: React.ReactNode }) {
  return (
    <T.TooltipProvider>
      <T.Tooltip>
        <T.TooltipTrigger asChild>
          <Info className="size-4 text-primary print:hidden" />
        </T.TooltipTrigger>
        <T.TooltipContent>{children}</T.TooltipContent>
      </T.Tooltip>
    </T.TooltipProvider>
  );
}
