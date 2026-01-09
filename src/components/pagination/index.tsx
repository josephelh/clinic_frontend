import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-center space-x-2 py-4 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-brand-500 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 dark:border-navy-700 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700"
      >
        <MdChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(Number(page))}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-brand-500 text-white shadow-md hover:bg-brand-600"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-brand-500 dark:border-navy-700 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-brand-500 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 dark:border-navy-700 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700"
      >
        <MdChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
