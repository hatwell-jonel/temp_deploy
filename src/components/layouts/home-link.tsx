import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface HomeLinkProps {
  className?: string;
}

export function HomeLink({ className }: HomeLinkProps) {
  return (
    <Link href="/">
      <Image
        src="/images/capex-logo.png"
        alt="Logo"
        priority
        className={cn("mb-6 ml-8", className)}
        width={127}
        height={58}
      />
    </Link>
  );
}
