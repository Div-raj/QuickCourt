import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Venue } from '../types';
import { LocationPinIcon } from './icons';
import StarRating from './StarRating';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/venues/${venue.id}`);
  };

  return (
    <div className="bg-surface rounded-2xl shadow-lg-soft hover:shadow-xl-soft transition-all duration-300 flex flex-col group overflow-hidden border border-border/50 hover:border-accent/30">
      <div className="relative">
        <img className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-300" src={venue.images[0]} alt={venue.name} />
        <div className="absolute top-3 right-3 bg-secondary/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold capitalize">
          {venue.sports[0] || 'Sport Venue'}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-secondary truncate" title={venue.name}>{venue.name}</h3>
        <div className="flex items-center text-sm text-secondary/70 mt-1">
          <LocationPinIcon className="w-4 h-4 mr-1.5 text-secondary/50 shrink-0" />
          <span className="truncate">{venue.location}</span>
        </div>
        <div className="flex items-center mt-3">
          <StarRating rating={venue.rating} />
          <span className="text-sm text-secondary font-medium ml-2">{venue.rating.toFixed(1)}</span>
          <span className="text-sm text-secondary/50 ml-1">({venue.reviewCount} reviews)</span>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex-grow flex items-end justify-between">
          <div>
            {venue.pricePerHour ? (
              <>
                <p className="text-sm text-secondary/70">Starts from</p>
                <p className="text-xl font-bold text-accent">₹{venue.pricePerHour}<span className="text-sm font-normal text-secondary/70">/hr</span></p>
              </>
            ) : (
                <p className="text-sm text-secondary/70">Pricing not available</p>
            )}
          </div>
          <button 
            onClick={handleViewDetails}
            className="bg-accent text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg-accent hover:bg-accent-dark transform group-hover:scale-105">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;