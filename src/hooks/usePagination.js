import { useState, useCallback, useMemo } from 'react';

/**
 * Pagination state management hook
 * @param {object} options
 * @returns {object} Pagination state and controls
 */
export const usePagination = ({ initialPage = 1, initialLimit = 10 } = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const nextPage = useCallback(() => {
    if (hasNext) setPage((p) => p + 1);
  }, [hasNext]);

  const prevPage = useCallback(() => {
    if (hasPrev) setPage((p) => p - 1);
  }, [hasPrev]);

  const goToPage = useCallback((p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  }, [totalPages]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 on limit change
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    setTotal,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    reset,
    setPage,
  };
};
