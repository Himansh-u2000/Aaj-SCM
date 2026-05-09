import { memo } from 'react';

/**
 * Timeline component for shipment tracking history.
 * Matches the Figma tracking history design.
 */
const Timeline = ({ events = [], className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {events.map((event, index) => {
        const isFirst = index === 0;
        const isLast = index === events.length - 1;
        const isException = event.isException;

        return (
          <div key={event.id || index} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-secondary-200" />
            )}

            {/* Dot */}
            <div className="relative flex-shrink-0 mt-0.5">
              <div
                className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${isFirst && isException
                    ? 'border-red-500 bg-red-500'
                    : isFirst
                      ? 'border-primary bg-primary'
                      : event.completed
                        ? 'border-primary bg-primary'
                        : 'border-secondary-300 bg-white'
                  }
                `}
              >
                {(event.completed || isFirst) && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p
                    className={`text-sm font-semibold ${isException ? 'text-red-600' : isFirst ? 'text-primary' : 'text-secondary-800'}`}
                  >
                    {event.event}
                  </p>
                  <p className="text-xs text-secondary-500 mt-0.5">
                    {event.location}
                    {event.facility && ` (${event.facility})`}
                  </p>
                </div>
                <span className="text-xs text-secondary-500 whitespace-nowrap flex-shrink-0">
                  {event.formattedTime || new Date(event.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Exception note */}
              {event.isException && event.exceptionNote && (
                <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  Exception: {event.exceptionNote}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Timeline);
