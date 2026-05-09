import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo-1-1-300x108.jpg';

/**
 * Navigation icons as inline SVGs
 */
const NavIcon = ({ icon, className = '' }) => {
  const icons = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    orders: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    shipments: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    inventory: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    reports: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  };

  return icons[icon] || null;
};

/**
 * Sidebar component — white background matching Figma design.
 */
const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-secondary-100 z-40
          w-[220px] flex flex-col transition-transform duration-300 ease-in-out
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-secondary-100">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-secondary-100">
            <img src={logo} alt="AAJ" className="w-7 h-auto object-contain" />
          </div>
          <div>
            <h1 className="text-base font-bold text-secondary-800 leading-tight">AAJ SCM</h1>
            <p className="text-[10px] text-secondary-400 leading-tight">Logistics Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && onClose()}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50'
                  }
                `}
              >
                <NavIcon icon={item.icon} className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Track Shipment Button at bottom */}
        <div className="px-3 pb-4">
          <NavLink
            to="/shipments"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Track Shipment
          </NavLink>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-3 border-t border-secondary-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-secondary-800 truncate">{user.name}</p>
              <p className="text-[10px] text-secondary-400 truncate">{user.role}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default memo(Sidebar);
