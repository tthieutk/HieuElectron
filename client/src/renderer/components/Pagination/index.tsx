import React from 'react';
import './Pagination.scss';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { totalPages, currentPage, onPageChange } = props;

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextPage = currentPage + 1;
    onPageChange(nextPage > totalPages ? 1 : nextPage);
  };

  const handlePreviousClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const previousPage = currentPage - 1;
    onPageChange(previousPage < 1 ? totalPages : previousPage);
  };

  return (
    <ul className="list-page">
      {totalPages === 1 || currentPage === 1 ? null : (
        <li>
          <a href="#" onClick={(e) => handlePreviousClick(e)}>
            Previous
          </a>
        </li>
      )}
      {pageNumbers.map((pageNumber) => (
        <li
          key={pageNumber}
          className={pageNumber === currentPage ? 'active' : ''}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pageNumber);
            }}
          >
            {pageNumber}
          </a>
        </li>
      ))}
      {totalPages === 1 || currentPage === totalPages ? null : (
        <li>
          <a href="#" onClick={(e) => handleNextClick(e)}>
            Next
          </a>
        </li>
      )}
    </ul>
  );
};
