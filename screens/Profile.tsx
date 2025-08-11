
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BOOKINGS } from '../constants';
import BookingCard from '../components/BookingCard';
import { Booking } from '../types';
import { EyeIcon, EyeOffIcon, CalendarIcon, ClockIcon, TrophyIcon } from '../components/icons';


const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-50 p-4 rounded-xl flex items-center border border-gray-200">
      <div className="p-3 rounded-full bg-primary-light text-primary mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-text-dark">{value}</p>
      </div>
    </div>
);


const Profile: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [userBookings, setUserBookings] = useState<Booking[]>(BOOKINGS);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    if (!user) {
        return <div className="text-center py-20">Please log in to view your profile.</div>;
    }
    
    const handleCancelBooking = (bookingId: string) => {
        setUserBookings(prev => prev.map(b => b.id === bookingId ? {...b, status: 'Cancelled'} : b));
    }

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'bookings', label: 'My Bookings' },
        { id: 'profile', label: 'Edit Profile' },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar */}
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <div className="flex flex-col items-center">
                                <img src={user.avatar} alt={user.fullName} className="w-24 h-24 rounded-full border-4 border-primary-light" />
                                <h2 className="mt-4 text-xl font-bold text-gray-800">{user.fullName}</h2>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <nav className="mt-6 space-y-2">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm ${activeTab === tab.id ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-200'}`}>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="md:w-3/4">
                        {activeTab === 'overview' && (
                             <div className="bg-white rounded-xl shadow-md p-8">
                                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Stats</h1>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <StatCard title="Total Bookings" value={userBookings.length} icon={<CalendarIcon />} />
                                    <StatCard title="Hours Played" value="12" icon={<ClockIcon />} />
                                    <StatCard title="Favorite Sport" value="Badminton" icon={<TrophyIcon />} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'bookings' && (
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>
                                <div className="space-y-6">
                                    {userBookings.length > 0 ? userBookings.map(booking => (
                                        <BookingCard key={booking.id} booking={booking} onCancel={handleCancelBooking}/>
                                    )) : (
                                        <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm">
                                            <p>You have no bookings yet. Time to play!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-md p-8">
                                <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input type="text" defaultValue={user.fullName} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input type="email" defaultValue={user.email} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"/>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Old Password</label>
                                        <div className="relative mt-1">
                                            <input type={showOldPassword ? "text" : "password"} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                                             <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                {showOldPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                                            </button>
                                        </div>
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                                        <div className="relative mt-1">
                                            <input type={showNewPassword ? "text" : "password"} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                {showNewPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button type="button" className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Reset</button>
                                        <button type="submit" className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
