import { useState, memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import Sidebar from '../components/Sidebar/Sidebar';
import SearchBar from '../components/SearchBar/SearchBar';
import { useIsMobile } from '../hooks/useMediaQuery';

/**
 * Dashboard layout — sidebar + header + content.
 * Matches the Figma orders management layout.
 */
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} isMobile={isMobile} />

      {/* Main area */}
      <div className="lg:ml-[220px] min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-secondary-100 px-4 lg:px-6 h-[60px] flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-secondary-600 hover:text-secondary-800 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search bar — hidden on small mobile */}
          <div className="hidden sm:block flex-1 max-w-md">
            <SearchBar
              value={headerSearch}
              onChange={setHeaderSearch}
              placeholder="Search orders, tracking..."
            />
          </div>

          <div className="flex-1 sm:hidden" />

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* User avatar */}
            <button
              onClick={() => dispatch(logout())}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-secondary-50 transition-colors"
              title="Logout"
            >
              <div className="w-8 h-8 rounded-full bg-secondary-700 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
              </div>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
