import { memo } from 'react';

/**
 * Loader component with spinner and skeleton variants.
 */

export const Spinner = memo(({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={`animate-spin text-primary ${sizeClasses[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
});
Spinner.displayName = 'Spinner';

export const Skeleton = memo(({ width = 'w-full', height = 'h-4', rounded = 'rounded', className = '' }) => {
  return (
    <div
      className={`${width} ${height} ${rounded} bg-gradient-to-r from-secondary-100 via-secondary-200 to-secondary-100 bg-[length:200%_100%] animate-skeleton ${className}`}
    />
  );
});
Skeleton.displayName = 'Skeleton';

export const TableSkeleton = memo(({ rows = 5, cols = 6 }) => {
  return (
    <div className="p-5 space-y-0">
      {/* Header skeleton */}
      <div className="flex items-center gap-6 pb-4 mb-4 border-b border-secondary-100">
        <Skeleton width="w-4" height="h-4" rounded="rounded" />
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} width={j === 0 ? 'w-20' : j === cols - 1 ? 'w-16' : 'w-28'} height="h-3" rounded="rounded" />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 py-4 border-b border-secondary-50 last:border-0">
          <Skeleton width="w-4" height="h-4" rounded="rounded" />
          <Skeleton width="w-20" height="h-4" rounded="rounded" />
          <Skeleton width="w-36" height="h-4" rounded="rounded" />
          <Skeleton width="w-24" height="h-4" rounded="rounded-md" className="hidden md:block" />
          <Skeleton width="w-28" height="h-4" rounded="rounded" className="hidden lg:block" />
          <Skeleton width="w-20" height="h-4" rounded="rounded" className="hidden sm:block" />
          <Skeleton width="w-16" height="h-5" rounded="rounded-full" />
          <div className="flex gap-2 ml-auto">
            <Skeleton width="w-6" height="h-6" rounded="rounded" />
            <Skeleton width="w-6" height="h-6" rounded="rounded" />
            <Skeleton width="w-6" height="h-6" rounded="rounded" />
          </div>
        </div>
      ))}
    </div>
  );
});
TableSkeleton.displayName = 'TableSkeleton';

export const CardSkeleton = memo(({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-secondary-100 p-6 space-y-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton width="w-28" height="h-3" rounded="rounded" />
          <Skeleton width="w-20" height="h-9" rounded="rounded-md" />
        </div>
        <Skeleton width="w-10" height="h-10" rounded="rounded-xl" />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Skeleton width="w-14" height="h-3" rounded="rounded" />
        <Skeleton width="w-20" height="h-3" rounded="rounded" />
      </div>
    </div>
  );
});
CardSkeleton.displayName = 'CardSkeleton';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Spinner size="lg" />
  </div>
);

export default memo(PageLoader);
