import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_ALL_USERS, MOCK_VENUES, BOOKINGS } from '../../constants';
import { UsersIcon, BuildingLibraryIcon, CalendarIcon, CurrencyDollarIcon, SparklesIcon, ChartBarIcon } from '../../components/icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode, subtext?: string }> = ({ title, value, icon, subtext }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between">
    <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
    <div className="p-3 rounded-full bg-accent/10 text-accent">
        {icon}
    </div>
  </div>
);

const ChartPlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-80 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-md">
            <p className="text-gray-400">Chart Data Coming Soon</p>
        </div>
    </div>
);


const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    
    const totalUsers = MOCK_ALL_USERS.filter(u => u.role === 'user').length;
    const totalFacilitators = MOCK_ALL_USERS.filter(u => u.role === 'facilitator').length;
    const totalBookings = BOOKINGS.length;
    const totalVenues = MOCK_VENUES.length;
    const pendingVenues = MOCK_VENUES.filter(v => v.status === 'pending').length;
    const monthlyEarnings = BOOKINGS.reduce((sum, booking) => sum + booking.totalPrice, 0) * 0.1; // Assuming 10% commission

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Welcome, {user?.fullName.split(' ')[0]}!</h1>
                <p className="text-gray-600 mt-1">Here's the pulse of your platform.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={totalUsers} icon={<UsersIcon className="w-6 h-6"/>} />
                <StatCard title="Total Venues" value={totalVenues} icon={<BuildingLibraryIcon className="w-6 h-6"/>} subtext={`${pendingVenues} pending approval`} />
                <StatCard title="Total Bookings" value={totalBookings} icon={<CalendarIcon className="w-6 h-6"/>} />
                <StatCard title="Simulated Earnings" value={`₹${monthlyEarnings.toLocaleString()}`} icon={<CurrencyDollarIcon className="w-6 h-6"/>} subtext="Based on 10% of bookings" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <ChartPlaceholder title="Booking Activity Over Time" />
                 <ChartPlaceholder title="New User Registrations" />
                 <ChartPlaceholder title="Most Active Sports" />
                 <ChartPlaceholder title="Facility Approval Trends" />
            </div>
        </div>
    );
};

export default AdminDashboard;
