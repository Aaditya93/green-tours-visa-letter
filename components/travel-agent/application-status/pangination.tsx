import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponentTravelAgent = ({
  currentPage,
  totalPages,
  itemsPerPage,
  stage,
}: {
  stage: string;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}) => {
  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={
              showPrevious
                ? `travel-agent/application/${stage}/${
                    (currentPage - 1) * itemsPerPage
                  }`
                : undefined
            }
            aria-disabled={!showPrevious}
            className={!showPrevious ? "pointer-events-none opacity-50" : ""}
          ></PaginationPrevious>
        </PaginationItem>

        {getPageNumbers().map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={`travel-agent/application/${stage}/${
                pageNumber * itemsPerPage
              }`}
              isActive={currentPage === pageNumber}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={
              showNext
                ? `travel-agent/application/${stage}/${
                    (currentPage + 1) * itemsPerPage
                  }`
                : undefined
            }
            aria-disabled={!showNext}
            className={!showNext ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponentTravelAgent;
