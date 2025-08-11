
import React from 'react';

const Events: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">Upcoming Events</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Discover tournaments, workshops, and social games happening at venues near you.
        </p>
        <div className="mt-12 bg-white p-12 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-accent">Coming Soon!</h2>
          <p className="mt-4 text-gray-600">
            We are working hard to bring you a comprehensive list of sports events. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;
