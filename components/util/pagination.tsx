import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const getHref = (page: number) => {
    return page === 1 ? "/blogs" : `/blogs/page/${page}`;
  };

  return (
    <nav className="flex justify-center items-center mt-8 space-x-2" aria-label="Pagination">
      {prevPage && (
        <Link href={getHref(prevPage)} className="px-3 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          Previous
        </Link>
      )}
      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={getHref(page)}
          className={`px-3 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${page === currentPage ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        >
          {page}
        </Link>
      ))}
      {nextPage && (
        <Link href={getHref(nextPage)} className="px-3 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          Next
        </Link>
      )}
    </nav>
  );
};
