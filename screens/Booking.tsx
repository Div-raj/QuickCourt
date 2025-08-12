import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Venue, Booking as BookingType } from '../types';
import { GEOAPIFY_API_KEY } from '../config';
import StarRating from '../components/StarRating';
import { LocationPinIcon, UserIcon } from '../components/icons';
import { transformGeoapifyPlaceToVenue } from '../utils/dataTransformers';
import { BOOKINGS } from '../constants';

interface BookingConfirmationDetails {
    venueName: string;
    sport: string;
    date: string;
    timeSlot: string;
    price: string;
    bookingId: string;
    numberOfPlayers: number;
}

const Booking: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState('17:00');
    const [duration, setDuration] = useState(1);
    const [numberOfPlayers, setNumberOfPlayers] = useState(2);
    const [selectedSport, setSelectedSport] = useState<string>('');
    const [confirmationDetails, setConfirmationDetails] = useState<BookingConfirmationDetails | null>(null);
    
    useEffect(() => {
        const fetchVenueDetails = async () => {
          if (!id) {
            setError("No venue ID provided.");
            setLoading(false);
            return;
          };
          setLoading(true);
          setError(null);
          try {
            const res = await fetch(`https://api.geoapify.com/v2/place-details?id=${id}&apiKey=${GEOAPIFY_API_KEY}`);
            if (!res.ok) {
                throw new Error('Failed to fetch venue details. The venue may no longer be available.');
            }
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                 const place = data.features[0];
                 const transformedVenue = transformGeoapifyPlaceToVenue(place);
                 setVenue(transformedVenue);
                 // Set default sport
                 if (transformedVenue.sports.length > 0 && transformedVenue.sports[0] !== 'General Sports') {
                     setSelectedSport(transformedVenue.sports[0]);
                 } else {
                     setSelectedSport('Football'); // Default to first in predefined list
                 }
            } else {
                throw new Error('Venue not found.');
            }
          } catch (e: any) {
            console.error("Failed to fetch venue details for booking", e);
            setError(e.message || "An unexpected error occurred while fetching venue details.");
          } finally {
            setLoading(false);
          }
        };
        fetchVenueDetails();
    }, [id]);
    
    const handleConfirmBooking = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!venue) return;

        const startTime = selectedTime;
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHour = hours + duration;
        const endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const newBooking: BookingType = {
            id: `b${Date.now()}`,
            venue: {
                id: venue.id,
                name: venue.name,
                location: venue.location,
            },
            court: { id: `c${Date.now()}`, name: `${selectedSport} Court`, pricePerHour: venue.pricePerHour || 0 },
            date: selectedDate,
            startTime,
            endTime,
            totalPrice: (venue.pricePerHour || 0) * duration,
            status: 'Confirmed',
            numberOfPlayers: numberOfPlayers,
        };

        try {
            const storedBookingsRaw = localStorage.getItem('quickcourt_bookings');
            const currentBookings: BookingType[] = storedBookingsRaw ? JSON.parse(storedBookingsRaw) : BOOKINGS;
            const updatedBookings = [...currentBookings, newBooking];
            localStorage.setItem('quickcourt_bookings', JSON.stringify(updatedBookings));
        } catch (err) {
            console.error("Failed to save booking to localStorage", err);
        }

        setConfirmationDetails({
            venueName: venue.name,
            sport: selectedSport,
            date: new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            timeSlot: `${startTime} - ${endTime}`,
            price: `₹${(venue.pricePerHour || 0) * duration} (to be paid at venue)`,
            bookingId: newBooking.id,
            numberOfPlayers: newBooking.numberOfPlayers,
        });
    };
    
    const availableSports = (venue?.sports && venue.sports.length > 1) || (venue?.sports.length === 1 && venue.sports[0] !== 'General Sports')
        ? venue.sports
        : ['Football', 'Badminton', 'Tennis', 'Table Tennis', 'Basketball', 'Cricket Turf'];

    if (loading) {
         return (
            <div className="flex justify-center items-center h-screen bg-primary">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent"></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-4">
                <div className="text-center py-10 px-6 bg-red-50 text-red-700 rounded-lg shadow-md max-w-lg mx-auto">
                    <h3 className="font-bold text-xl mb-2">Could Not Load Booking</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!venue) {
        return <div className="text-center py-20 bg-primary">Venue could not be loaded.</div>;
    }
    
    return (
        <div className="bg-primary min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-secondary mb-2">Court Booking</h1>
                <p className="text-lg text-secondary/70 mb-8">Finalize your booking details for your selected venue.</p>
                
                <div className="bg-surface rounded-2xl shadow-xl-soft p-8 border border-border">
                    {/* Venue Info */}
                    <div className="pb-6 border-b border-border">
                        <h2 className="text-2xl font-bold text-secondary">{venue.name}</h2>
                        <div className="flex items-center mt-2 text-secondary/80">
                            <LocationPinIcon className="w-5 h-5 mr-1.5" />
                            <span className="mr-4">{venue.location}</span>
                            <StarRating rating={venue.rating} />
                            <span className="ml-2 text-sm font-semibold">{venue.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    
                    {/* Booking Form */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-bold text-secondary mb-2">Date</label>
                            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent text-secondary" />
                        </div>
                        
                        <div>
                             <label className="block text-sm font-bold text-secondary mb-2">Start Time</label>
                            <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent text-secondary" />
                        </div>

                         <div>
                            <label className="block text-sm font-bold text-secondary mb-2">Sport</label>
                            <select value={selectedSport} onChange={e => setSelectedSport(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white capitalize text-secondary">
                                {availableSports.map(sport => <option key={sport} value={sport}>{sport}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-secondary mb-2">Duration</label>
                            <select value={duration} onChange={e => setDuration(Number(e.target.value))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white text-secondary">
                                <option value={1}>1 Hour</option>
                                <option value={2}>2 Hours</option>
                                <option value={3}>3 Hours</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-secondary mb-2">Number of Players</label>
                            <div className="flex items-center gap-4 bg-primary/40 p-2 rounded-lg max-w-xs">
                                <button type="button" onClick={() => setNumberOfPlayers(p => Math.max(1, p - 1))} className="w-10 h-10 flex items-center justify-center text-2xl font-bold bg-surface text-accent rounded-md shadow-sm hover:bg-accent/10 transition-colors">-</button>
                                <span className="text-xl font-bold text-secondary flex-grow text-center">{numberOfPlayers}</span>
                                <button type="button" onClick={() => setNumberOfPlayers(p => p + 1)} className="w-10 h-10 flex items-center justify-center text-2xl font-bold bg-surface text-accent rounded-md shadow-sm hover:bg-accent/10 transition-colors">+</button>
                            </div>
                        </div>

                    </div>
                    
                    {/* Payment Button */}
                    <div className="mt-8 pt-6 border-t border-border">
                        <button
                            onClick={handleConfirmBooking}
                            className="w-full bg-accent text-white font-bold py-4 rounded-lg text-lg hover:bg-accent-dark transition-all duration-300 shadow-lg-accent">
                            Confirm Booking
                        </button>
                         <p className="text-center text-sm text-secondary/60 mt-4">Pricing and payment will be handled at the venue.</p>
                    </div>
                </div>
            </div>
            
            {confirmationDetails && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
                    <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all scale-95 duration-300 border-border" style={{ transform: 'scale(1)' }}>
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-secondary mb-2">Booking Confirmed!</h2>
                            <p className="text-sm text-secondary/70 mb-6">Your booking request has been received. You will pay at the venue.</p>
                        </div>
                        
                        <div className="space-y-4 text-sm bg-primary/40 p-4 rounded-lg border border-border">
                            <div className="flex justify-between"><span className="font-semibold text-secondary/80">Venue:</span> <span className="font-bold text-secondary text-right">{confirmationDetails.venueName}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-secondary/80">Sport:</span> <span className="font-bold text-secondary">{confirmationDetails.sport}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-secondary/80">Date:</span> <span className="font-bold text-secondary text-right">{confirmationDetails.date}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-secondary/80">Time Slot:</span> <span className="font-bold text-secondary">{confirmationDetails.timeSlot}</span></div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-secondary/80">Players:</span> 
                                <span className="font-bold text-secondary flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" /> {confirmationDetails.numberOfPlayers}
                                </span>
                            </div>
                            <div className="flex justify-between"><span className="font-semibold text-secondary/80">Price:</span> <span className="font-bold text-accent">{confirmationDetails.price}</span></div>
                            <div className="flex justify-between items-center"><span className="font-semibold text-secondary/80">Booking ID:</span> <span className="font-mono text-xs bg-gray-200 text-secondary px-2 py-1 rounded">{confirmationDetails.bookingId}</span></div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <button onClick={() => navigate('/profile')} className="w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-transform transform hover:scale-105">
                                View My Bookings
                            </button>
                            <button onClick={() => navigate('/connect')} className="w-full bg-surface border border-accent text-accent font-bold py-3 px-6 rounded-lg hover:bg-accent/10 transition-colors">
                                Find Players
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;