
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPORTS } from '../constants';
import { ChevronRightIcon } from '../components/icons';

const SportIconCard: React.FC<{ sport: typeof SPORTS[0] }> = ({ sport }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate('/venues')}
      className="flex flex-col items-center justify-center text-center group cursor-pointer"
    >
      <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl">
        <img src={sport.image} alt={sport.name} className="w-24 h-24 md:w-32 md:h-32 object-contain transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-text-dark transition-colors duration-300 group-hover:text-primary">{sport.name}</h3>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 text-text-dark">

      {/* Hero Section */}
      <section className="bg-primary-light" style={{backgroundImage: 'linear-gradient(rgba(255, 224, 233, 0.8), rgba(255, 224, 233, 0.8)), url(https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=2070&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold text-text-dark">Your Next Game Awaits</h1>
              <p className="mt-4 text-xl text-text-dark max-w-3xl mx-auto">The ultimate platform to discover, book, and play at the best sports venues near you.</p>
              <button onClick={() => navigate('/venues')} className="mt-8 bg-primary text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300 shadow-lg">
                  Find a Venue Now
              </button>
          </div>
      </section>

      {/* Find a Venue Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-text-dark">Find By Sport</h2>
            <button onClick={() => navigate('/venues')} className="hidden sm:flex items-center font-semibold text-primary hover:underline">
              Explore all venues <ChevronRightIcon className="w-5 h-5 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-8">
            {SPORTS.map(sport => (
              <SportIconCard key={sport.name} sport={sport} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
