
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Venue } from '../types';
import { GEOAPIFY_API_KEY } from '../config';
import StarRating from '../components/StarRating';
import { LocationPinIcon } from '../components/icons';
import { transformGeoapifyPlaceToVenue } from '../utils/dataTransformers';

interface BookingConfirmationDetails {
    venueName: string;
    sport: string;
    date: string;
    timeSlot: string;
    price: string;
    bookingId: string;
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

        setConfirmationDetails({
            venueName: venue.name,
            sport: selectedSport,
            date: new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            timeSlot: `${startTime} - ${endTime}`,
            price: `₹${(venue.pricePerHour || 0) * duration} (to be paid at venue)`,
            bookingId: `QC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
    };
    
    const availableSports = (venue?.sports && venue.sports.length > 1) || (venue?.sports.length === 1 && venue.sports[0] !== 'General Sports')
        ? venue.sports
        : ['Football', 'Badminton', 'Tennis', 'Table Tennis', 'Basketball', 'Cricket Turf'];

    if (loading) {
         return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center py-10 px-6 bg-red-50 text-red-700 rounded-lg shadow-md max-w-lg mx-auto">
                    <h3 className="font-bold text-xl mb-2">Could Not Load Booking</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!venue) {
        return <div className="text-center py-20">Venue could not be loaded.</div>;
    }
    
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Court Booking</h1>
                <p className="text-lg text-gray-600 mb-8">Finalize your booking details for your selected venue.</p>
                
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Venue Info */}
                    <div className="pb-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">{venue.name}</h2>
                        <div className="flex items-center mt-2 text-gray-600">
                            <LocationPinIcon className="w-5 h-5 mr-1.5" />
                            <span className="mr-4">{venue.location}</span>
                            <StarRating rating={venue.rating} />
                            <span className="ml-2 text-sm">{venue.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    
                    {/* Booking Form */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                            <select value={duration} onChange={e => setDuration(Number(e.target.value))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white">
                                <option value={1}>1 Hour</option>
                                <option value={2}>2 Hours</option>
                                <option value={3}>3 Hours</option>
                            </select>
                        </div>

                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Sport</label>
                            <select value={selectedSport} onChange={e => setSelectedSport(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white capitalize">
                                {availableSports.map(sport => <option key={sport} value={sport}>{sport}</option>)}
                            </select>
                        </div>
                        
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                            <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                    </div>
                    
                    {/* Payment Button */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleConfirmBooking}
                            className="w-full bg-primary text-white font-bold py-4 rounded-lg text-lg hover:bg-opacity-90 transition-colors">
                            Confirm Booking
                        </button>
                         <p className="text-center text-sm text-gray-500 mt-4">Pricing and payment will be handled at the venue.</p>
                    </div>
                </div>
            </div>
            
            {confirmationDetails && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all scale-95 duration-300" style={{ transform: 'scale(1)' }}>
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                            <p className="text-sm text-gray-500 mb-6">Your booking request has been received. You will pay at the venue.</p>
                        </div>
                        
                        <div className="space-y-4 text-sm bg-gray-50 p-4 rounded-lg border">
                            <div className="flex justify-between"><span className="font-semibold text-gray-600">Venue:</span> <span className="font-bold text-right">{confirmationDetails.venueName}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-gray-600">Sport:</span> <span className="font-bold">{confirmationDetails.sport}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-gray-600">Date:</span> <span className="font-bold text-right">{confirmationDetails.date}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-gray-600">Time Slot:</span> <span className="font-bold">{confirmationDetails.timeSlot}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-gray-600">Price:</span> <span className="font-bold">{confirmationDetails.price}</span></div>
                            <div className="flex justify-between items-center"><span className="font-semibold text-gray-600">Booking ID:</span> <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{confirmationDetails.bookingId}</span></div>
                        </div>

                        <div className="mt-6">
                            <button onClick={() => setConfirmationDetails(null)} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
