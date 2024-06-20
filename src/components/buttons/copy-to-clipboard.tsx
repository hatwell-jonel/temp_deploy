"use client";

import { toast } from "sonner";

interface CopyToClipboardProps
  extends React.ComponentPropsWithoutRef<"button"> {
  textToCopy: string;
}

export function CopyToClipboard({
  children,
  onClick,
  textToCopy,
  ...props
}: CopyToClipboardProps) {
  return (
    <button
      onClick={(e) => {
        navigator.clipboard.writeText(textToCopy);
        toast.success(`Copied ${textToCopy} !`);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
