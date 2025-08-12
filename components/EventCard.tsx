import React from 'react';
import { Event } from '../types';
import { LocationPinIcon, CalendarIcon, ClockIcon, TrophyIcon, UserIcon } from './icons';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const registrationProgress = (event.participants / event.maxParticipants) * 100;

  return (
    <div className="bg-surface rounded-2xl shadow-lg-soft hover:shadow-xl-soft transition-all duration-300 flex flex-col group overflow-hidden border border-border/50 hover:border-accent/30">
      <div className="relative">
        <img className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300" src={event.image} alt={event.name} />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-accent/90 text-white text-xs px-3 py-1 rounded-full font-bold uppercase">
          {event.sport}
        </div>
        <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{event.name}</h3>
            <div className="flex items-center text-sm mt-1 opacity-90">
                <LocationPinIcon className="w-4 h-4 mr-1.5" />
                <span>{event.venue.name}, {event.venue.location}</span>
            </div>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
              <div className="flex items-center text-secondary/90">
                  <CalendarIcon className="w-4 h-4 mr-2 text-accent" />
                  <span className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center text-secondary/90">
                  <ClockIcon className="w-4 h-4 mr-2 text-accent" />
                  <span className="font-semibold">{event.startTime} Onwards</span>
              </div>
              <div className="flex items-center text-secondary/90">
                  <TrophyIcon className="w-4 h-4 mr-2 text-accent" />
                  <span className="font-semibold">₹{event.prizePool.toLocaleString()} Prize Pool</span>
              </div>
              <div className="flex items-center text-secondary/90">
                  <UserIcon className="w-4 h-4 mr-2 text-accent" />
                  <span className="font-semibold">{event.format}</span>
              </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs text-secondary/80 mb-1">
                <span>Registration</span>
                <span>{event.participants} / {event.maxParticipants}</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: `${registrationProgress}%` }}></div>
            </div>
          </div>

        <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
            <div>
              <p className="text-sm text-secondary/70">Entry Fee</p>
              <p className="text-xl font-bold text-accent">₹{event.entryFee}</p>
            </div>
            <button 
                className="bg-accent text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg-accent hover:bg-accent-dark transform group-hover:scale-105"
                onClick={() => alert(`Registration for ${event.name} is not yet implemented.`)}>
                Register Now
            </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
