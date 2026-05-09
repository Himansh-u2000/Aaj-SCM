import { memo, useMemo } from 'react';

/**
 * Pagination component matching the Figma design.
 */
const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  className = '',
}) => {
  const pages = useMemo(() => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);

      if (page > 3) items.push('...');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) items.push(i);

      if (page < totalPages - 2) items.push('...');

      items.push(totalPages);
    }

    return items;
  }, [page, totalPages]);

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      <span className="text-sm text-secondary-500">
        Showing {from} to {to} of {total.toLocaleString()} entries
      </span>
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-md text-secondary-500 hover:bg-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-secondary-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`
                w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors
                ${p === page
                  ? 'bg-primary text-white'
                  : 'text-secondary-600 hover:bg-secondary-100'
                }
              `}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-md text-secondary-500 hover:bg-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default memo(Pagination);
