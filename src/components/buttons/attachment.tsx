"use client";

import { Icons } from "@/components/icons";
import { ShowAttachment } from "@/components/show-attachment";
import { Badge } from "@/components/ui/badge";
import * as React from "react";

export default function AttachmentButtonInput(
  props: React.ComponentPropsWithoutRef<"input">,
) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<FileList | null | undefined>(null);

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge
          variant={"outline"}
          className="flex w-fit cursor-pointer items-center whitespace-nowrap border-gray-400 text-[8px]"
          onClick={() => fileRef.current?.click()}
        >
          <Icons.add className="mr-2 size-2.5" />
          {files && files?.length !== 0 ? "Change" : "Add"} Attachment
        </Badge>
        {files ? <ShowAttachment files={files} /> : <div className="w-4" />}
      </div>
      <input
        multiple
        {...props}
        onChange={(e) => setFiles(e.target.files)}
        type="file"
        className="hidden"
        ref={fileRef}
      />
    </>
  );
}
