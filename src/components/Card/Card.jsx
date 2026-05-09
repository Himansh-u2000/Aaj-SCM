import { memo } from 'react';

/**
 * Reusable Card component.
 */
const Card = ({ children, className = '', hover = false, padding = 'p-5', ...props }) => {
  return (
    <div
      className={`
        bg-white rounded-xl border border-secondary-100 shadow-card
        ${hover ? 'hover:shadow-card-hover transition-shadow duration-200' : ''}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default memo(Card);
