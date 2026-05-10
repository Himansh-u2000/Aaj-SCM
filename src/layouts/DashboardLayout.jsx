import { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar/Sidebar';
import NotificationDropdown from '../components/NotificationDropdown/NotificationDropdown';
import { useIsMobile } from '../hooks/useMediaQuery';
import { logout } from '../store/authSlice';

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
        <header className="sticky top-0 z-30 bg-white border-b border-secondary-100 px-4 lg:px-6 h-[60px] flex items-center justify-end gap-4">
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
          {/* <div className="hidden sm:block flex-1 max-w-md">
            <SearchBar
              value={headerSearch}
              onChange={setHeaderSearch}
              placeholder="Search orders, tracking..."
            />
          </div> */}

          <div className="flex-1 sm:hidden" />

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <NotificationDropdown />

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
