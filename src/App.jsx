import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { useAuth } from './context/useAuth';

// ─── Eager: Landing is the first page users see ─────────────────────────────
import LandingPage from './pages/LandingPage';

// ─── Lazy: All app pages — loaded only when navigated to ────────────────────
const Home           = lazy(() => import('./pages/student/Home'));
const ListingDetail  = lazy(() => import('./pages/student/ListingDetail'));
const RoommateFinder = lazy(() => import('./pages/student/RoommateFinder'));
const Wallet         = lazy(() => import('./pages/student/Wallet'));
const Profile        = lazy(() => import('./pages/student/Profile'));
const Dashboard      = lazy(() => import('./pages/landlord/Dashboard'));
const CreateListing  = lazy(() => import('./pages/landlord/CreateListing'));
const Approval       = lazy(() => import('./pages/admin/Approval'));

// ─── Fallback spinner ────────────────────────────────────────────────────────
const PageSpinner = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', color: 'var(--text-muted)',
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      border: '3px solid var(--glass-border)',
      borderTopColor: 'var(--primary)',
      animation: 'spin 0.7s linear infinite',
    }} />
  </div>
);

// ─── Protected Route ─────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/search" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/search" replace />;
  return children;
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>
        {/* Landing — eager, no Suspense needed */}
        <Route path="/" element={<LandingPage />} />

        {/* App shell — all children are lazy */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Suspense fallback={<PageSpinner />}>
              <Routes>
                {/* Roommates page - renders full-width outside the container */}
                <Route path="/roommates" element={<RoommateFinder />} />

                {/* All other app pages - render inside standard container */}
                <Route path="*" element={
                  <div className="container" style={{ marginTop: '24px' }}>
                    <Routes>
                      <Route path="/search" element={<Home />} />
                      <Route path="/wallet" element={
                        <ProtectedRoute allowedRoles={['student', 'landlord', 'admin']}>
                          <Wallet />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute allowedRoles={['student', 'landlord', 'admin']}>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      <Route path="/listing/:id" element={<ListingDetail />} />
                      <Route path="/landlord" element={
                        <ProtectedRoute allowedRoles={['landlord']}>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/landlord/create" element={
                        <ProtectedRoute allowedRoles={['landlord']}>
                          <CreateListing />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <Approval />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </div>
                } />
              </Routes>
            </Suspense>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
