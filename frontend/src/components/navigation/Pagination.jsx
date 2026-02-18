import { motion } from 'framer-motion';
import Button from '../ui/Button';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {/* First Page */}
        {showFirstLast && currentPage > 1 && (
          <PaginationButton page={1} disabled={currentPage === 1} onClick={onPageChange}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 9H17a1 1 0 110 2h-5.586l3.293 3.293a1 1 0 010 1.414zM7 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </PaginationButton>
        )}

        {/* Previous Page */}
        {showPrevNext && (
          <PaginationButton page={currentPage - 1} disabled={currentPage === 1} onClick={onPageChange}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </PaginationButton>
        )}

        {/* Ellipsis before visible pages */}
        {visiblePages[0] > 1 && (
          <>
            {visiblePages[0] > 2 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            )}
          </>
        )}

        {/* Visible Page Numbers */}
        {visiblePages.map((page) => (
          <PaginationButton
            key={page}
            page={page}
            isActive={page === currentPage}
            onClick={onPageChange}
          >
            {page}
          </PaginationButton>
        ))}

        {/* Ellipsis after visible pages */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            )}
          </>
        )}

        {/* Next Page */}
        {showPrevNext && (
          <PaginationButton page={currentPage + 1} disabled={currentPage === totalPages} onClick={onPageChange}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </PaginationButton>
        )}

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages && (
          <PaginationButton page={totalPages} disabled={currentPage === totalPages} onClick={onPageChange}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 11H3a1 1 0 110-2h5.586L5.293 5.707a1 1 0 010-1.414zM13 17a1 1 0 001-1V4a1 1 0 10-2 0v12a1 1 0 001 1z" clipRule="evenodd" />
            </svg>
          </PaginationButton>
        )}
      </nav>
      
      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-700">
        Halaman {currentPage} dari {totalPages}
      </div>
    </div>
  );
};

const PaginationButton = ({ page, isActive = false, disabled = false, children, onClick, ...props }) => (
  <motion.button
    className={`
      relative inline-flex items-center px-4 py-2 text-sm font-medium border transition-all duration-200
      ${isActive
        ? 'z-10 bg-primary-600 border-primary-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      first:rounded-l-md last:rounded-r-md
    `}
    disabled={disabled}
    onClick={() => !disabled && onClick(page)}
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    {...props}
  >
    {children}
  </motion.button>
);

export default Pagination;