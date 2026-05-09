import { memo } from 'react';

/**
 * Custom Checkbox component matching the Figma design (red checkbox).
 */
const Checkbox = ({ checked = false, indeterminate = false, onChange, disabled = false, label, id, className = '' }) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`
            w-4 h-4 rounded border-2 transition-all duration-150 flex items-center justify-center
            ${checked || indeterminate
              ? 'bg-primary border-primary'
              : 'border-secondary-300 bg-white hover:border-secondary-400'
            }
          `}
        >
          {checked && !indeterminate && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {indeterminate && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-sm text-secondary-700">{label}</span>}
    </label>
  );
};

export default memo(Checkbox);
