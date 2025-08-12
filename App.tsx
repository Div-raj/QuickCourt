import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './screens/Home';
import AuthScreen from './screens/AuthScreen';
import VenueList from './screens/VenueList';
import VenueDetails from './screens/VenueDetails';
import Booking from './screens/Booking';
import Profile from './screens/Profile';
import FacilitatorAuthScreen from './screens/facilitator/AuthScreen';
import FacilitatorDashboard from './screens/facilitator/Dashboard';
import AddVenue from './screens/facilitator/AddVenue';
import PlayerConnect from './screens/PlayerConnect';
import Events from './screens/Events';
import Lobbies from './screens/Lobbies';
import LobbyDetails from './screens/LobbyDetails';
import AdminAuthScreen from './screens/admin/AuthScreen';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './screens/admin/Dashboard';
import FacilityApproval from './screens/admin/FacilityApproval';
import UserManagement from './screens/admin/UserManagement';
import AdminProfile from './screens/admin/AdminProfile';


const AppLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen font-sans text-secondary">
    <Header />
    <main className="flex-grow bg-primary animation-fadeIn">
      <Outlet />
    </main>
    <Footer />
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animation-fadeIn {
        animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
    `}</style>
  </div>
);

const ProtectedRoute: React.FC<{ role?: 'user' | 'facilitator' | 'admin' }> = ({ role = 'user' }) => {
    const { isAuthenticated, loading, user } = useAuth();
    if(loading) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div> // Or a spinner
    
    if (!isAuthenticated) {
        let redirectPath = '/auth';
        if (role === 'facilitator') redirectPath = '/facilitator/auth';
        if (role === 'admin') redirectPath = '/admin/auth';
        return <Navigate to={redirectPath} replace />;
    }
    
    if (user?.role !== role) {
        // If wrong role, redirect to a safe page
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/facilitator/auth" element={<FacilitatorAuthScreen />} />
          <Route path="/admin/auth" element={<AdminAuthScreen />} />

          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="venues" element={<VenueList />} />
            <Route path="venues/:id" element={<VenueDetails />} />
            
            {/* User Protected Routes */}
            <Route element={<ProtectedRoute role="user" />}>
              <Route path="book/:id" element={<Booking />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connect" element={<PlayerConnect />} />
              <Route path="events" element={<Events />} />
              <Route path="lobbies" element={<Lobbies />} />
              <Route path="lobbies/:id" element={<LobbyDetails />} />
            </Route>
            
            {/* Facilitator Protected Routes */}
            <Route path="facilitator" element={<ProtectedRoute role="facilitator" />}>
              <Route path="dashboard" element={<FacilitatorDashboard />} />
              <Route path="add-venue" element={<AddVenue />} />
            </Route>

             {/* Admin Protected Routes */}
            <Route path="admin" element={<ProtectedRoute role="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="facilities" element={<FacilityApproval />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;