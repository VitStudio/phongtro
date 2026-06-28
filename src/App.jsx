import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/student/Home';
import ListingDetail from './pages/student/ListingDetail';
import Dashboard from './pages/landlord/Dashboard';
import CreateListing from './pages/landlord/CreateListing';
import Approval from './pages/admin/Approval';
import LandingPage from './pages/LandingPage';
import RoommateFinder from './pages/student/RoommateFinder';
import Wallet from './pages/student/Wallet';
import Profile from './pages/student/Profile';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/search" />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/search" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/*" element={
          <>
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/search" element={<Home />} />
                <Route path="/roommates" element={<RoommateFinder />} />
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
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
