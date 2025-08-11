
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

const AppLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen font-sans">
    <Header />
    <main className="flex-grow bg-gray-50 animation-fadeIn">
      <Outlet />
    </main>
    <Footer />
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animation-fadeIn {
        animation: fadeIn 0.5s ease-in-out;
      }
    `}</style>
  </div>
);

const ProtectedRoute: React.FC<{ role?: 'user' | 'facilitator' }> = ({ role = 'user' }) => {
    const { isAuthenticated, loading, user } = useAuth();
    if(loading) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div> // Or a spinner
    
    if (!isAuthenticated) {
        return <Navigate to={role === 'facilitator' ? '/facilitator/auth' : '/auth'} replace />;
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
            </Route>
            
            {/* Facilitator Protected Routes */}
            <Route path="facilitator" element={<ProtectedRoute role="facilitator" />}>
              <Route path="dashboard" element={<FacilitatorDashboard />} />
              <Route path="add-venue" element={<AddVenue />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
