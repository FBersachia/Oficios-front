import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPreviousNext?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
  className?: string;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext = true,
  showFirstLast = false,
  maxVisiblePages = 7,
  size = 'md',
  variant = 'default',
  className = '',
  disabled = false,
}) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'h-8 w-8 text-xs',
          navButton: 'h-8 px-2 text-xs',
        };
      case 'lg':
        return {
          button: 'h-12 w-12 text-base',
          navButton: 'h-12 px-4 text-base',
        };
      default:
        return {
          button: 'h-10 w-10 text-sm',
          navButton: 'h-10 px-3 text-sm',
        };
    }
  };

  const getVariantClasses = (isActive: boolean) => {
    switch (variant) {
      case 'outline':
        return isActive
          ? 'bg-blue-600 text-white border-blue-600'
          : 'border border-gray-300 text-gray-700 hover:bg-gray-50';
      case 'minimal':
        return isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100';
      default:
        return isActive
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
    }
  };

  const sizeClasses = getSizeClasses();

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust the range if we're near the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis');
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav
      className={cn('flex items-center justify-center space-x-1', className)}
      aria-label="Paginación"
    >
      {/* First page button */}
      {showFirstLast && currentPage > 1 && (
        <Button
          onClick={() => handlePageClick(1)}
          disabled={disabled || currentPage === 1}
          variant="outline"
          size="sm"
          className={cn(sizeClasses.navButton)}
        >
          Primero
        </Button>
      )}

      {/* Previous page button */}
      {showPreviousNext && (
        <Button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          variant="outline"
          size="sm"
          className={cn(
            'flex items-center space-x-1',
            sizeClasses.navButton
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
      )}

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <div
                key={`ellipsis-${index}`}
                className={cn(
                  'flex items-center justify-center',
                  sizeClasses.button
                )}
              >
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            );
          }

          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              onClick={() => handlePageClick(page)}
              disabled={disabled}
              variant="ghost"
              size="sm"
              className={cn(
                'transition-colors',
                sizeClasses.button,
                getVariantClasses(isActive)
              )}
              aria-label={`Ir a la página ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next page button */}
      {showPreviousNext && (
        <Button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          variant="outline"
          size="sm"
          className={cn(
            'flex items-center space-x-1',
            sizeClasses.navButton
          )}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages && (
        <Button
          onClick={() => handlePageClick(totalPages)}
          disabled={disabled || currentPage === totalPages}
          variant="outline"
          size="sm"
          className={cn(sizeClasses.navButton)}
        >
          Último
        </Button>
      )}
    </nav>
  );
};

// Simple pagination with just numbers
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  disabled = false,
}) => (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={onPageChange}
    showPreviousNext={false}
    showFirstLast={false}
    maxVisiblePages={5}
    variant="minimal"
    size="sm"
    className={className}
    disabled={disabled}
  />
);

// Pagination with page info
interface PaginationWithInfoProps extends PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  showInfo?: boolean;
  infoPosition?: 'top' | 'bottom' | 'side';
}

export const PaginationWithInfo: React.FC<PaginationWithInfoProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  infoPosition = 'bottom',
  className = '',
  ...paginationProps
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const infoText = (
    <p className="text-sm text-gray-700">
      Mostrando{' '}
      <span className="font-medium">{startItem}</span>
      {' - '}
      <span className="font-medium">{endItem}</span>
      {' de '}
      <span className="font-medium">{totalItems}</span>
      {' resultados'}
    </p>
  );

  const paginationComponent = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      {...paginationProps}
    />
  );

  if (!showInfo) {
    return paginationComponent;
  }

  if (infoPosition === 'side') {
    return (
      <div className={cn(
        'flex items-center justify-between',
        className
      )}>
        {infoText}
        {paginationComponent}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {infoPosition === 'top' && (
        <div className="flex justify-center">
          {infoText}
        </div>
      )}

      <div className="flex justify-center">
        {paginationComponent}
      </div>

      {infoPosition === 'bottom' && (
        <div className="flex justify-center">
          {infoText}
        </div>
      )}
    </div>
  );
};

// Hook for pagination state management
interface UsePaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
}

export const usePagination = (
  totalItems: number,
  options: UsePaginationOptions = {}
) => {
  const { initialPage = 1, itemsPerPage = 10 } = options;
  const [currentPage, setCurrentPage] = React.useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = React.useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = React.useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = React.useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToFirstPage = React.useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = React.useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  // Reset to first page if total items change
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalItems, totalPages, currentPage]);

  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems),
  };
};

// Pagination components collection
export const PaginationComponents = {
  Default: Pagination,
  Simple: SimplePagination,
  WithInfo: PaginationWithInfo,
  usePagination,
};

export default Pagination;