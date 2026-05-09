import { memo, useState, useRef, useEffect } from 'react';

/**
 * Dropdown/Select component.
 */
const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''} ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between gap-2 rounded-lg border border-secondary-200 
            bg-white px-4 py-2.5 text-sm text-secondary-800 
            hover:border-secondary-300 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            ${fullWidth ? 'w-full' : 'min-w-[160px]'}
          `}
        >
          <span className={value ? 'text-secondary-800' : 'text-secondary-400'}>
            {value || placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-secondary-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-secondary-100 shadow-dropdown py-1 max-h-60 overflow-y-auto animate-fade-in">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(typeof option === 'object' ? option.value : option)}
                className={`
                  w-full text-left px-4 py-2 text-sm transition-colors duration-100
                  ${(typeof option === 'object' ? option.value : option) === value
                    ? 'bg-primary-50 text-primary font-medium'
                    : 'text-secondary-700 hover:bg-secondary-50'
                  }
                `}
              >
                {typeof option === 'object' ? option.label : option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Dropdown);
