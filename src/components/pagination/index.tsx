import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as Peygination,
} from "@/components/ui/pagination";

export function Pagination({
  meta,
}: {
  meta: {
    previous: number;
    next: number;
    pages: {
      number: number;
      isActive: boolean;
    }[];
    currentPage: number;
  };
}) {
  return (
    <Peygination className="mt-4 justify-start">
      <PaginationContent>
        {meta.pages.length > 0 && (
          <PaginationItem>
            <PaginationPrevious href={`?page=${meta.previous}`} />
          </PaginationItem>
        )}
        {meta.pages.map((page) => (
          <PaginationItem key={page.number}>
            <PaginationLink
              href={`?page=${page.number}`}
              isActive={page.isActive}
            >
              {page.number}
            </PaginationLink>
          </PaginationItem>
        ))}
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        {meta.pages.length > 0 && (
          <PaginationItem>
            <PaginationNext href={`?page=${meta.next}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Peygination>
  );
}
