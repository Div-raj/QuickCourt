import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ChartBarIcon, ShieldCheckIcon, BuildingLibraryIcon, UserIcon as ProfileIcon, MenuIcon, CloseIcon } from '../icons';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { to: '/admin/dashboard', icon: <ChartBarIcon className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/admin/facilities', icon: <BuildingLibraryIcon className="w-5 h-5" />, label: 'Facility Approval' },
        { to: '/admin/users', icon: <ShieldCheckIcon className="w-5 h-5" />, label: 'User Management' },
        { to: '/admin/profile', icon: <ProfileIcon className="w-5 h-5" />, label: 'My Profile' },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-white">QUICKCOURT</h1>
                <p className="text-sm text-gray-400">Admin Panel</p>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isActive
                                ? 'bg-accent text-white shadow-lg'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`
                        }
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/20"
                >
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-secondary text-white hidden lg:flex flex-col fixed h-full shadow-lg">
                {sidebarContent}
            </aside>
            
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="relative w-64 max-w-xs h-full bg-secondary text-white flex flex-col shadow-lg">
                    {sidebarContent}
                </div>
            </div>
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            <div className="flex-1 flex flex-col lg:pl-64">
                <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <button className="lg:hidden text-gray-600" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                        <div className="flex-1 flex justify-end">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.fullName}</span>
                                <img
                                    className="h-9 w-9 rounded-full object-cover"
                                    src={user?.avatar}
                                    alt={user?.fullName}
                                />
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
