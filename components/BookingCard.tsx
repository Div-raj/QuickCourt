
import React from 'react';
import { Booking } from '../types';
import { CalendarIcon, ClockIcon, LocationPinIcon } from './icons';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
    const isPastBooking = new Date(booking.date) < new Date();

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{booking.venue.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <LocationPinIcon className="w-4 h-4 mr-1.5" />
                        <span>{booking.venue.location}</span>
                    </div>
                </div>
                <div className={`mt-2 sm:mt-0 text-sm font-semibold px-3 py-1 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {booking.status}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                    <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-primary" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                <div><span className="font-semibold">Court:</span> {booking.court?.name || 'N/A'}</div>
                <div><span className="font-semibold">Total:</span> ₹{booking.totalPrice.toLocaleString()}</div>
            </div>
            {booking.status === 'Confirmed' && !isPastBooking && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
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