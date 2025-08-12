import React from 'react';
import { MOCK_EVENTS } from '../constants';
import EventCard from '../components/EventCard';

const Events: React.FC = () => {
  return (
    <div className="bg-primary min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-secondary">Tournaments & Events</h1>
          <p className="text-xl text-secondary/80 mt-4 max-w-3xl mx-auto">
            Test your skills, compete for prizes, and connect with the community. Find your next challenge here.
          </p>
        </div>
        
        {MOCK_EVENTS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_EVENTS.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-12 bg-surface p-12 rounded-xl shadow-lg-soft border border-border">
            <h2 className="text-2xl font-bold text-accent text-center">No Events Currently</h2>
            <p className="mt-4 text-secondary/80 text-center">
              We are working hard to bring you a comprehensive list of sports events. Please check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
