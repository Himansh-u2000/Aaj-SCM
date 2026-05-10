import { memo, useMemo } from 'react';
import { SHIPMENT_STATUS } from '../../utils/constants';

/**
 * RouteProgress — dynamic route visualization showing origin, destination,
 * and a truck icon positioned based on shipment progress.
 *
 * Props:
 *  - origin: { name, code }
 *  - destination: { name, code }
 *  - status: shipment status string
 *  - timeline: array of timeline events
 *  - compact: if true, renders a smaller inline version for cards
 */
const TruckIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const RouteProgress = ({ origin, destination, status, timeline = [], compact = false }) => {
  const progress = useMemo(() => {
    if (status === SHIPMENT_STATUS.DELIVERED) return 100;
    if (status === SHIPMENT_STATUS.PENDING) return 5;
    if (status === SHIPMENT_STATUS.OUT_FOR_DELIVERY) return 85;

    if (timeline.length > 0) {
      const completedSteps = timeline.filter((e) => e.completed).length;
      const totalSteps = timeline.length;
      const pct = Math.round((completedSteps / Math.max(totalSteps, 1)) * 100);

      if (status === SHIPMENT_STATUS.DELAYED || status === SHIPMENT_STATUS.EXCEPTION) {
        return Math.min(pct, 60);
      }
      return Math.max(10, Math.min(pct, 90));
    }

    return 30;
  }, [status, timeline]);

  const isDelivered = status === SHIPMENT_STATUS.DELIVERED;
  const isDelayed = status === SHIPMENT_STATUS.DELAYED || status === SHIPMENT_STATUS.EXCEPTION;

  /* ── Compact variant for shipment cards ── */
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Origin code */}
        <span className="text-xs font-semibold text-secondary-700 flex-shrink-0">{origin.code}</span>

        {/* Progress track */}
        <div className="relative flex-1 h-5 flex items-center">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-secondary-200 rounded-full" />
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full transition-all duration-700 ${isDelayed ? 'bg-red-400' : isDelivered ? 'bg-green-500' : 'bg-primary'
              }`}
            style={{ width: `${progress}%` }}
          />

          {/* Truck / check */}
          {isDelivered ? (
            <div className="absolute right-1 translate-x-1/2 z-10">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ) : (
            <div
              className="absolute z-10 transition-all duration-700"
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${isDelayed ? 'bg-red-50 border border-red-200' : 'bg-white border border-primary/30'
                }`}>
                <TruckIcon className={`w-3 h-3 ${isDelayed ? 'text-red-500' : 'text-primary'}`} />
              </div>
            </div>
          )}
        </div>

        {/* Destination code */}
        <span className="text-xs font-semibold text-secondary-700 flex-shrink-0">{destination.code}</span>
      </div>
    );
  }

  /* ── Full variant for drawer ── */
  return (
    <div className="px-3 py-3 border border-secondary-100 rounded-lg">
      <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider mb-3">Route Overview</p>

      {/* Origin / Destination labels */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm font-semibold text-secondary-800">{origin.name}</p>
          <p className="text-[10px] text-secondary-400">Origin ({origin.code})</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-secondary-800">{destination.name}</p>
          <p className="text-[10px] text-secondary-400">Destination ({destination.code})</p>
        </div>
      </div>

      {/* Progress bar with truck */}
      <div className="relative mt-2 h-6 flex items-center">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-secondary-200 rounded-full" />
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full transition-all duration-700 ${isDelayed ? 'bg-red-400' : isDelivered ? 'bg-green-500' : 'bg-primary'
            }`}
          style={{ width: `${progress}%` }}
        />

        {/* Origin dot */}
        <div className={`absolute left-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 z-10 ${progress > 0 ? 'border-primary bg-primary' : 'border-secondary-300 bg-white'
          }`} />

        {/* Destination dot */}
        <div className={`absolute right-0 translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 z-10 ${isDelivered ? 'border-green-500 bg-green-500' : 'border-secondary-300 bg-white'
          }`} />

        {/* Truck icon */}
        {!isDelivered && (
          <div
            className="absolute z-20 transition-all duration-700"
            style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${isDelayed ? 'bg-red-50 border border-red-200' : 'bg-white border border-primary/30'
              }`}>
              <TruckIcon className={`w-4 h-4 ${isDelayed ? 'text-red-500' : 'text-primary'}`} />
            </div>
          </div>
        )}

        {/* Delivered checkmark */}
        {isDelivered && (
          <div className="absolute right-0 translate-x-1/2 z-20">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Progress label */}
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-[10px] font-semibold ${isDelayed ? 'text-red-500' : isDelivered ? 'text-green-600' : 'text-primary'
          }`}>
          {isDelivered ? 'Delivered' : isDelayed ? `${progress}% — Delayed` : `${progress}% Complete`}
        </span>
        <span className="text-[10px] text-secondary-400">
          {timeline.filter(e => e.completed).length}/{timeline.length} checkpoints
        </span>
      </div>
    </div>
  );
};

export default memo(RouteProgress);
