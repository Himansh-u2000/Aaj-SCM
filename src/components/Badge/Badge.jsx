import { memo } from 'react';
import { STATUS_COLORS } from '../../utils/constants';

/**
 * Badge component for status display.
 * 
 * @param {'Delivered'|'In Transit'|'Delayed'|'Pending'|'Processing'|'Exception'|'Out for Delivery'|'Cancelled'} props.status
 * @param {'sm'|'md'} props.size
 * @param {boolean} props.dot - Show dot indicator
 */
const Badge = ({ status, size = 'sm', dot = false, className = '' }) => {
  const colors = STATUS_COLORS[status] || {
    bg: 'bg-secondary-100',
    text: 'text-secondary-600',
    dot: 'bg-secondary-600',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap
        ${colors.bg} ${colors.text}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${status === 'In Transit' || status === 'Out for Delivery' ? 'animate-pulse-dot' : ''}`} />
      )}
      {status}
    </span>
  );
};

export default memo(Badge);
