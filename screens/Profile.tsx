
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BOOKINGS } from '../constants';
import BookingCard from '../components/BookingCard';
import { Booking } from '../types';
import { EyeIcon, EyeOffIcon, CalendarIcon, ClockIcon, TrophyIcon, CloseIcon } from '../components/icons';


const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface p-4 rounded-xl flex items-center border border-border/50 shadow-lg-soft">
      <div className="p-3 rounded-full bg-accent/10 text-accent mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-secondary/70">{title}</p>
        <p className="text-2xl font-bold text-secondary">{value}</p>
      </div>
    </div>
);


const Profile: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'bookings');
    
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    const [userBookings, setUserBookings] = useState<Booking[]>(() => {
        try {
            const storedBookingsRaw = localStorage.getItem('quickcourt_bookings');
            if (storedBookingsRaw) {
                return JSON.parse(storedBookingsRaw);
            }
            localStorage.setItem('quickcourt_bookings', JSON.stringify(BOOKINGS));
            return BOOKINGS;
        } catch (error) {
            console.error("Failed to load bookings from localStorage", error);
            return BOOKINGS; // Fallback to initial constants
        }
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

    if (!user) {
        return <div className="text-center py-20 bg-primary">Please log in to view your profile.</div>;
    }
    
    const handleCancelBookingClick = (bookingId: string) => {
        const booking = userBookings.find(b => b.id === bookingId);
        if (booking) {
            setBookingToCancel(booking);
        }
    };

    const confirmCancelBooking = () => {
        if (bookingToCancel) {
            const updatedBookings = userBookings.map(b => 
                b.id === bookingToCancel.id ? { ...b, status: 'Cancelled' as const } : b
            );
            setUserBookings(updatedBookings);
            try {
                 localStorage.setItem('quickcourt_bookings', JSON.stringify(updatedBookings));
            } catch (error) {
                console.error("Failed to save cancellation to localStorage", error);
            }
            setBookingToCancel(null);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'bookings', label: 'My Bookings' },
        { id: 'profile', label: 'Edit Profile' },
    ];
    
    const commonInputClass = "w-full px-4 py-2 border border-border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow bg-primary/30 text-secondary";
    const commonLabelClass = "block text-sm font-bold text-secondary mb-2";

    return (
        <>
            <div className="bg-primary min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Sidebar */}
                        <div className="md:w-1/4">
                            <div className="bg-surface rounded-xl shadow-xl-soft p-6 sticky top-24 border border-border">
                                <div className="flex flex-col items-center">
                                    <img src={user.avatar} alt={user.fullName} className="w-24 h-24 rounded-full border-4 border-accent/20" />
                                    <h2 className="mt-4 text-xl font-bold text-secondary">{user.fullName}</h2>
                                    <p className="text-sm text-secondary/60">{user.email}</p>
                                </div>
                                <nav className="mt-6 space-y-2">
                                    {tabs.map(tab => (
                                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm ${activeTab === tab.id ? 'bg-accent/10 text-accent' : 'text-secondary/80 hover:bg-secondary/5'}`}>
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="md:w-3/4">
                            {activeTab === 'overview' && (
                                <div className="bg-surface rounded-xl shadow-xl-soft p-8 border border-border">
                                    <h1 className="text-2xl font-bold text-secondary mb-6">My Stats</h1>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <StatCard title="Total Bookings" value={userBookings.length} icon={<CalendarIcon />} />
                                        <StatCard title="Hours Played" value={userBookings.reduce((acc, b) => {
                                            if (b.status === 'Confirmed') {
                                                const start = parseInt(b.startTime.split(':')[0]);
                                                const end = parseInt(b.endTime.split(':')[0]);
                                                return acc + (end - start);
                                            }
                                            return acc;
                                        }, 0)} icon={<ClockIcon />} />
                                        <StatCard title="Favorite Sport" value="Badminton" icon={<TrophyIcon />} />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'bookings' && (
                                <div>
                                    <h1 className="text-2xl font-bold text-secondary mb-6">My Bookings</h1>
                                    <div className="space-y-6">
                                        {userBookings.length > 0 ? [...userBookings].reverse().map(booking => (
                                            <BookingCard key={booking.id} booking={booking} onCancel={handleCancelBookingClick}/>
                                        )) : (
                                            <div className="text-center py-10 px-4 bg-surface rounded-lg shadow-lg-soft border border-border">
                                                <p className="text-secondary/70">You have no bookings yet. Time to play!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'profile' && (
                                <div className="bg-surface rounded-xl shadow-xl-soft p-8 border border-border space-y-12">
                                    {/* Personal Info */}
                                    <section>
                                        <h2 className="text-xl font-bold text-secondary border-b border-border pb-3 mb-6">Personal Information</h2>
                                        <form className="space-y-4">
                                            <div>
                                                <label htmlFor="fullName" className={commonLabelClass}>Full Name</label>
                                                <input id="fullName" type="text" defaultValue={user.fullName} className={commonInputClass} />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className={commonLabelClass}>Email Address</label>
                                                <input id="email" type="email" defaultValue={user.email} className={`${commonInputClass} bg-secondary/10 cursor-not-allowed`} readOnly />
                                            </div>
                                            <div>
                                                <label htmlFor="avatar" className={commonLabelClass}>Avatar URL</label>
                                                <input id="avatar" type="text" defaultValue={user.avatar} className={commonInputClass} />
                                            </div>
                                            <div className="pt-2">
                                                <button type="submit" className="bg-accent text-white font-semibold px-6 py-2 rounded-lg hover:bg-accent-dark transition-colors shadow-lg-accent">Save Changes</button>
                                            </div>
                                        </form>
                                    </section>

                                    {/* Change Password */}
                                    <section>
                                        <h2 className="text-xl font-bold text-secondary border-b border-border pb-3 mb-6">Change Password</h2>
                                        <form className="space-y-4">
                                            <div className="relative">
                                                <label htmlFor="oldPassword" className={commonLabelClass}>Old Password</label>
                                                <input id="oldPassword" type={showOldPassword ? "text" : "password"} className={commonInputClass} />
                                                <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute inset-y-0 right-0 top-7 pr-4 flex items-center">
                                                    {showOldPassword ? <EyeOffIcon className="h-5 w-5 text-secondary/50" /> : <EyeIcon className="h-5 w-5 text-secondary/50" />}
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <label htmlFor="newPassword" className={commonLabelClass}>New Password</label>
                                                <input id="newPassword" type={showNewPassword ? "text" : "password"} className={commonInputClass} />
                                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 top-7 pr-4 flex items-center">
                                                    {showNewPassword ? <EyeOffIcon className="h-5 w-5 text-secondary/50" /> : <EyeIcon className="h-5 w-5 text-secondary/50" />}
                                                </button>
                                            </div>
                                            <div className="pt-2">
                                                <button type="submit" className="bg-accent text-white font-semibold px-6 py-2 rounded-lg hover:bg-accent-dark transition-colors shadow-lg-accent">Update Password</button>
                                            </div>
                                        </form>
                                    </section>

                                    {/* Delete Account */}
                                     <section>
                                        <h2 className="text-xl font-bold text-red-600 border-b border-red-200 pb-3 mb-6">Delete Account</h2>
                                        <p className="text-sm text-secondary/70 mb-4">
                                            Once you delete your account, there is no going back. Please be certain. All your booking history and profile data will be permanently erased.
                                        </p>
                                        <button className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-500/30">
                                            Delete My Account
                                        </button>
                                    </section>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancellation Modal */}
            {bookingToCancel && (
                <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
                    <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all scale-95 duration-300 border-border" style={{ transform: 'scale(1)' }}>
                        <div className="flex justify-between items-start">
                             <h2 className="text-xl font-bold text-secondary mb-2">Confirm Cancellation</h2>
                             <button onClick={() => setBookingToCancel(null)} className="p-1 rounded-full hover:bg-secondary/10">
                                <CloseIcon className="w-5 h-5 text-secondary/70" />
                            </button>
                        </div>

                        <p className="text-sm text-secondary/70 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>

                        <div className="space-y-3 text-sm bg-primary/40 p-4 rounded-lg border border-border">
                            <div className="flex justify-between"><span className="font-semibold text-secondary/80">Venue:</span> <span className="font-bold text-secondary text-right">{bookingToCancel.venue.name}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-secondary/80">Date:</span> <span className="font-bold text-secondary text-right">{new Date(bookingToCancel.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric'})}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-secondary/80">Time:</span> <span className="font-bold text-secondary">{bookingToCancel.startTime} - {bookingToCancel.endTime}</span></div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                             <button onClick={() => setBookingToCancel(null)} className="bg-surface border border-border text-secondary font-bold py-2.5 px-5 rounded-lg hover:bg-secondary/10 transition-colors">
                                Keep Booking
                            </button>
                            <button onClick={confirmCancelBooking} className="bg-red-600 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-500/30">
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;