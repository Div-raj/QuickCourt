import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserIcon, MenuIcon, CloseIcon } from './icons';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  
  const handleLoginClick = () => {
    navigate('/auth');
  };
  
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  const navLinks = (
    <>
      {(!isAuthenticated || user?.role === 'user') && (
        <Link to="/venues" className="hover:text-accent transition-colors px-3 py-2 rounded-md">Book A Venue</Link>
      )}
      {isAuthenticated && user?.role === 'user' && (
        <>
            <Link to="/lobbies" className="hover:text-accent transition-colors px-3 py-2 rounded-md">My Lobbies</Link>
            <Link to="/connect" className="hover:text-accent transition-colors px-3 py-2 rounded-md">Player Connect</Link>
            <Link to="/events" className="hover:text-accent transition-colors px-3 py-2 rounded-md">Events</Link>
        </>
      )}
      {!isAuthenticated && (
        <Link to="/facilitator/auth" className="hover:text-accent transition-colors px-3 py-2 rounded-md">For Business</Link>
      )}
    </>
  );

  return (
    <header className="bg-surface/90 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-extrabold text-accent">QUICKCOURT</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4 font-semibold text-secondary">
            {navLinks}
          </div>
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105">
                  <img src={user.avatar} alt={user.fullName} className="w-11 h-11 rounded-full border-2 border-accent" />
                  <span className="hidden sm:inline font-bold text-secondary">{user.fullName}</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-surface rounded-xl shadow-2xl py-2 z-50 border border-border">
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-bold text-secondary">Signed in as</p>
                        <p className="text-sm text-secondary/70 truncate">{user.email}</p>
                    </div>
                    {user.role === 'facilitator' ? (
                        <Link to="/facilitator/dashboard" className="block px-4 py-3 text-sm font-medium text-secondary hover:bg-accent/10 hover:text-accent transition-colors" onClick={() => setIsProfileOpen(false)}>My Dashboard</Link>
                    ) : user.role === 'admin' ? (
                         <Link to="/admin/dashboard" className="block px-4 py-3 text-sm font-medium text-secondary hover:bg-accent/10 hover:text-accent transition-colors" onClick={() => setIsProfileOpen(false)}>Admin Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/profile" state={{ activeTab: 'overview' }} className="block px-4 py-3 text-sm font-medium text-secondary hover:bg-accent/10 hover:text-accent transition-colors" onClick={() => setIsProfileOpen(false)}>My Profile</Link>
                            <Link to="/profile" state={{ activeTab: 'bookings' }} className="block px-4 py-3 text-sm font-medium text-secondary hover:bg-accent/10 hover:text-accent transition-colors" onClick={() => setIsProfileOpen(false)}>My Bookings</Link>
                        </>
                    )}
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:block">
                <button onClick={handleLoginClick} className="font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-300 px-5 py-2.5 rounded-lg shadow-sm hover:shadow-lg-accent">
                  Login / Sign Up
                </button>
              </div>
            )}
            <div className="md:hidden ml-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <CloseIcon className="w-7 h-7 text-secondary" /> : <MenuIcon className="w-7 h-7 text-secondary" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface py-4 border-t border-border">
          <div className="container mx-auto px-4 flex flex-col space-y-4 font-semibold text-secondary">
            {navLinks}
            {!isAuthenticated && (
                <button onClick={() => { handleLoginClick(); setIsMenuOpen(false); }} className="font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-300 text-center py-2.5 rounded-lg">
                  Login / Sign Up
                </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;