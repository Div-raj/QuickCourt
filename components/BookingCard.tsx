import React from 'react';
import { Booking } from '../types';
import { CalendarIcon, ClockIcon, LocationPinIcon, UserIcon } from './icons';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison

    // The booking date string "YYYY-MM-DD" is parsed as UTC midnight by default in some engines.
    // To avoid timezone issues, create a new Date from parts, which uses the local timezone.
    const dateParts = booking.date.split('-').map(Number);
    const bookingDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

    const isPastBooking = bookingDate < today;


    return (
        <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-lg-soft border border-border/50">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-secondary">{booking.venue.name}</h3>
                    <div className="flex items-center text-sm text-secondary/70 mt-1">
                        <LocationPinIcon className="w-4 h-4 mr-1.5" />
                        <span>{booking.venue.location}</span>
                    </div>
                </div>
                <div className={`mt-2 sm:mt-0 text-sm font-semibold px-3 py-1 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {booking.status}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-secondary">
                <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-3 text-accent" />
                    <span className="font-medium">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 mr-3 text-accent" />
                    <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-3 text-accent" />
                    <span className="font-medium">{booking.numberOfPlayers} Player{booking.numberOfPlayers > 1 ? 's' : ''}</span>
                </div>
                <div><span className="font-semibold text-secondary/70">Court:</span> <span className="font-medium">{booking.court?.name || 'N/A'}</span></div>
                <div><span className="font-semibold text-secondary/70">Total:</span> <span className="font-bold text-accent">₹{booking.totalPrice.toLocaleString()}</span></div>
            </div>
            {booking.status === 'Confirmed' && !isPastBooking && (
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <button 
                        onClick={() => onCancel(booking.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
                        Cancel Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookingCard;