import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { getRecentActivity } from '../../services/dashboardService';
import { getRelativeTime } from '../../utils/formatters';

const activityIcons = {
  order_created: (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>),
  shipment_delivered: (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>),
  delay_alert: (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  status_update: (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>),
  bulk_action: (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>),
  shipment_exception: (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
};

const activityColors = {
  order_created: 'bg-blue-100 text-blue-600',
  shipment_delivered: 'bg-green-100 text-green-600',
  delay_alert: 'bg-red-100 text-red-600',
  status_update: 'bg-purple-100 text-purple-600',
  bulk_action: 'bg-secondary-100 text-secondary-600',
  shipment_exception: 'bg-amber-100 text-amber-600',
};

/**
 * NotificationDropdown — shows 5 most recent activities when clicking the bell icon.
 * Closes on outside click or Escape key.
 */
const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const dropdownRef = useRef(null);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  // Fetch activity on first open
  useEffect(() => {
    if (open && !loaded) {
      getRecentActivity().then((res) => {
        if (res.success) setActivity(res.data.slice(0, 5));
        setLoaded(true);
      });
    }
  }, [open, loaded]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={toggle}
        className="relative p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-secondary-100 shadow-lg z-50 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-secondary-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-secondary-800">Recent Activity</h3>
            <span className="text-[10px] font-medium text-secondary-400 uppercase tracking-wider">Last 5</span>
          </div>

          {/* Activity list */}
          <div className="divide-y divide-secondary-50 max-h-80 overflow-y-auto">
            {activity.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-secondary-400">No recent activity</p>
              </div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="px-4 py-3 flex items-start gap-3 hover:bg-secondary-50/50 transition-colors cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${activityColors[item.type] || 'bg-secondary-100 text-secondary-600'}`}>
                    {activityIcons[item.type] || activityIcons.status_update}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-800">{item.title}</p>
                    <p className="text-xs text-secondary-500 mt-0.5 truncate">{item.description}</p>
                  </div>
                  <span className="text-[10px] text-secondary-400 flex-shrink-0 mt-1">{getRelativeTime(item.timestamp)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(NotificationDropdown);
