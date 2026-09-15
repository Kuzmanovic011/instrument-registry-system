import { useState } from "react";

interface PaginationButtonsProps {
  numButtons: number;
  onPageChange: (currentPage: number) => void;
  toFirstPage: boolean;
}
type VisiblePage = number | "...";

export const PaginationButtons = ({
  numButtons,
  onPageChange,
}: PaginationButtonsProps) => {
  const [activePage, setActivePage] = useState<number>(0);

  const totalPages = Number.isFinite(numButtons)
    ? Math.max(0, Math.floor(numButtons))
    : 0;

  if (totalPages <= 1) return null;

  const currentPage = Math.min(activePage, totalPages - 1);

  const visiblePages = getVisiblePages(currentPage, totalPages);

  const changePage = (page: number) => {
    const safePage = Math.min(Math.max(0, page), totalPages - 1);

    setActivePage(safePage);
    onPageChange(safePage);
  };

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1 border-t border-slate-200 px-4 py-3"
      aria-label="Paginacija"
    >
      <button
        className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Prethodna stranica"
      >
        ‹
      </button>

      {visiblePages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 min-w-9 items-center justify-center px-2 text-slate-500"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            className={
              "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors " +
              (page === currentPage
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50")
            }
            onClick={() => changePage(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page + 1}
          </button>
        );
      })}

      <button
        className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        aria-label="Sledeća stranica"
      >
        ›
      </button>
    </nav>
  );
};

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): VisiblePage[] {
  const pages: number[] = [];

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  pages.push(0);

  if (currentPage <= 2) {
    pages.push(1, 2, 3);
  } else if (currentPage >= totalPages - 3) {
    pages.push(totalPages - 4, totalPages - 3, totalPages - 2);
  } else {
    pages.push(currentPage - 1, currentPage, currentPage + 1);
  }

  pages.push(totalPages - 1);

  const result: VisiblePage[] = [];

  for (let i = 0; i < pages.length; i++) {
    const current = pages[i];

    if (i > 0 && current - pages[i - 1] > 1) {
      result.push("...");
    }

    result.push(current);
  }

  return result;
}
