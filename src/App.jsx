import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import { checkAuth } from './store/authSlice';
import DashboardLayout from './layouts/DashboardLayout';
import PageLoader from './components/Loader/Loader';
import ToastContainer from './components/Toast/Toast';

// Lazy-loaded pages for code splitting
const Login = lazy(() => import('./pages/Login/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Orders = lazy(() => import('./pages/Orders/Orders'));
const Shipments = lazy(() => import('./pages/Shipments/Shipments'));

/**
 * Protected Route — redirects to /login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <DashboardLayout>{children}</DashboardLayout>;
};

/**
 * Public Route — redirects to / if already authenticated
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

/**
 * App shell — dispatches initial auth check
 */
const AppShell = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />

          {/* Placeholder routes */}
          <Route path="/inventory" element={
            <ProtectedRoute>
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <svg className="w-16 h-16 text-secondary-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <h2 className="text-lg font-semibold text-secondary-700">Inventory Module</h2>
                  <p className="text-sm text-secondary-400 mt-1">Coming soon</p>
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <svg className="w-16 h-16 text-secondary-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <h2 className="text-lg font-semibold text-secondary-700">Reports Module</h2>
                  <p className="text-sm text-secondary-400 mt-1">Coming soon</p>
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
