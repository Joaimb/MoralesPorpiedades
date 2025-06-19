
import { useState, useMemo, useCallback } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

export function usePagination({ 
  totalItems, 
  itemsPerPage = 12, 
  initialPage = 1 
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNext = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPrevious = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const getPaginatedItems = useCallback(<T>(items: T[]): T[] => {
    return items.slice(startIndex, endIndex);
  }, [startIndex, endIndex]);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
    goToPage,
    goToNext,
    goToPrevious,
    getPaginatedItems,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
    hasItems: totalItems > 0
  };
}
