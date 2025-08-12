
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Venue, FacilitatorDashboardStats } from '../../types';
import { LocationPinIcon, CheckCircleIcon, ClockIcon, CalendarIcon, CurrencyDollarIcon } from '../../components/icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-gray-100 p-4 rounded-lg flex items-center">
    <div className="p-3 rounded-full bg-primary-light text-primary mr-4">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
                      <p className="text-2xl font-bold text-secondary">{value}</p>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: Venue['status'] }> = ({ status }) => {
    const baseClasses = "text-xs font-bold px-2.5 py-1 rounded-full";
    switch(status) {
        case 'approved': return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
        case 'pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
        case 'rejected': return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;
        default: return null;
    }
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [myVenues, setMyVenues] = useState<Venue[]>([]);
    const [stats, setStats] = useState<FacilitatorDashboardStats | null>(null);

    useEffect(() => {
        // Mock fetching venues and stats for the logged-in facilitator
        const mockVenues: Venue[] = [
            { id: 'v1', name: 'Pro Badminton Arena', location: 'Gachibowli, Hyderabad', rating: 4.8, reviewCount: 150, sports: ['Badminton'], images: ['/placeholder.jpg'], lat: 17.44, lon: 78.34, status: 'approved', submittedBy: 'f1', pricePerHour: 500 },
            { id: 'v2', name: 'PowerPlay Turf', location: 'Madhapur, Hyderabad', rating: 4.5, reviewCount: 98, sports: ['Football', 'Cricket'], images: ['/placeholder.jpg'], lat: 17.45, lon: 78.39, status: 'pending', submittedBy: 'f1', pricePerHour: 1200 },
        ];
        
        const mockStats: FacilitatorDashboardStats = {
            totalVenues: 2,
            approvedVenues: 1,
            pendingVenues: 1,
            totalBookings: 124,
            monthlyEarnings: 85000,
            peakHours: "6 PM - 8 PM"
        }

        setMyVenues(mockVenues);
        setStats(mockStats);
    }, []);

    const renderContent = () => {
        switch(activeTab) {
            case 'overview': return stats && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard title="Total Venues" value={stats.totalVenues} icon={<LocationPinIcon />} />
                        <StatCard title="Approved Venues" value={stats.approvedVenues} icon={<CheckCircleIcon />} />
                        <StatCard title="Pending Venues" value={stats.pendingVenues} icon={<ClockIcon />} />
                        <StatCard title="Total Bookings (Month)" value={stats.totalBookings} icon={<CalendarIcon />} />
                        <StatCard title="Earnings (Month)" value={`₹${stats.monthlyEarnings.toLocaleString()}`} icon={<CurrencyDollarIcon />} />
                        <StatCard title="Peak Hours" value={stats.peakHours} icon={<ClockIcon />} />
                    </div>
                </div>
            );
            case 'venues': return (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">My Venues</h2>
                        <button onClick={() => navigate('/facilitator/add-venue')} className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all">
                            + Add New Venue
                        </button>
                    </div>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {myVenues.map(venue => (
                                    <tr key={venue.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                                            <div className="text-sm text-gray-500">{venue.location}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={venue.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button className="text-primary hover:text-primary-dark">Edit</button>
                                            <button className="text-red-600 hover:text-red-800">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
            case 'bookings': return (
                 <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Bookings</h2>
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <p>Bookings management coming soon!</p>
                    </div>
                </div>
            )
            default: return null;
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">Welcome, {user?.fullName.split(' ')[0]}!</h1>
                    <p className="text-lg text-gray-500 mt-1">Here's what's happening with your venues today.</p>
                </header>
                
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('overview')} className={`${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Overview
                        </button>
                        <button onClick={() => setActiveTab('venues')} className={`${activeTab === 'venues' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            My Venues
                        </button>
                         <button onClick={() => setActiveTab('bookings')} className={`${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Bookings
                        </button>
                    </nav>
                </div>

                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
