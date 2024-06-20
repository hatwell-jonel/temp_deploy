import Image from "next/image";
import Link from "next/link";
import { Icons } from "./icons";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export function ShowAttachment({ files }: { files: FileList | File[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Icons.view className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[50vh] flex-wrap overflow-y-auto"
        showClose={true}
      >
        <Files files={files} />
      </DialogContent>
    </Dialog>
  );
}

function Files({ files }: { files: File[] | FileList }) {
  return (
    <>
      {Array.from(files).map((file) => {
        if (file.type.includes("image"))
          return (
            <Image
              key={file.name}
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="rounded-md border"
              width={100}
              height={100}
            />
          );
        return (
          <Link
            key={file.name}
            href={URL.createObjectURL(file)}
            target="_blank"
            className="text-blue-500 underline underline-offset-4"
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 15 15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>{file.name}</title>
              <path
                fill="none"
                stroke="#000000"
                d="M.5 0v4.5a2 2 0 1 0 4 0v-3a1 1 0 0 0-2 0V5M6 .5h6.5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1V8M11 4.5H7m4 3H7m4 3H4"
              />
            </svg>
            {file.name}
          </Link>
        );
      })}
    </>
  );
}

export function ShowAttachmentLinks({ fileUrls }: { fileUrls: string[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Icons.view className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[50vh] flex-wrap overflow-y-auto"
        showClose
      >
        {fileUrls.map((url) => {
          return (
            <Link
              key={url}
              href={url}
              target="_blank"
              className="text-blue-500 underline underline-offset-4"
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 15 15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>{url}</title>
                <path
                  fill="none"
                  stroke="#000000"
                  d="M.5 0v4.5a2 2 0 1 0 4 0v-3a1 1 0 0 0-2 0V5M6 .5h6.5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1V8M11 4.5H7m4 3H7m4 3H4"
                />
              </svg>
            </Link>
          );
        })}
      </DialogContent>
    </Dialog>
  );
}
