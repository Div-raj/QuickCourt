
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { REVIEWS, AMENITIES } from '../constants';
import { GeoapifyPlace, Venue } from '../types';
import { GEOAPIFY_API_KEY } from '../config';
import { 
    CheckCircleIcon, LocationPinIcon, ClockIcon, ParkingIcon, RestroomIcon, RefreshmentsIcon,
    CctvIcon, FirstAidIcon, LockerIcon, ShowerIcon, WifiIcon, SeatingIcon, FloodlightsIcon,
    PhoneIcon, GlobeAltIcon, NavigationIcon
} from '../components/icons';
import StarRating from '../components/StarRating';
import { transformGeoapifyPlaceToVenue } from '../utils/dataTransformers';


const VenueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [directionsStatus, setDirectionsStatus] = useState({ loading: false, error: '' });

  const getAmenityIcon = (amenityName: string) => {
    const iconProps = { className: "w-6 h-6 text-primary shrink-0" };
    switch (amenityName.toLowerCase()) {
        case 'parking': return <ParkingIcon {...iconProps} />;
        case 'restroom': return <RestroomIcon {...iconProps} />;
        case 'refreshments': return <RefreshmentsIcon {...iconProps} />;
        case 'cctv surveillance': return <CctvIcon {...iconProps} />;
        case 'first aid': return <FirstAidIcon {...iconProps} />;
        case 'locker room': return <LockerIcon {...iconProps} />;
        case 'showers': return <ShowerIcon {...iconProps} />;
        case 'wifi': return <WifiIcon {...iconProps} />;
        case 'seating area': return <SeatingIcon {...iconProps} />;
        case 'floodlights': return <FloodlightsIcon {...iconProps} />;
        default: return <CheckCircleIcon {...iconProps} />;
    }
};
  
  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!id) {
        setError("No venue ID provided.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.geoapify.com/v2/place-details?id=${id}&features=details.facilities,details.wiki_and_media,details.contact&apiKey=${GEOAPIFY_API_KEY}`);
        if (!res.ok) throw new Error('Failed to fetch venue details.');
        
        const data = await res.json();
        if (data.features.length === 0) throw new Error('Venue not found.');

        const transformedVenue = transformGeoapifyPlaceToVenue(data.features[0]);
        setVenue(transformedVenue);
        if (transformedVenue.images && transformedVenue.images.length > 0) {
            setSelectedImage(transformedVenue.images[0]);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenueDetails();
  }, [id]);

  const handleGetDirections = () => {
    if (!venue) return;

    setDirectionsStatus({ loading: true, error: '' });

    if (!navigator.geolocation) {
        setDirectionsStatus({ loading: false, error: 'Geolocation is not supported by your browser.' });
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${venue.lat},${venue.lon}&travelmode=driving`;
            window.open(googleMapsUrl, '_blank');
            setDirectionsStatus({ loading: false, error: '' });
        },
        (error) => {
            let errorMessage = 'Could not get your location.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'You denied the request for Geolocation. Please enable it in your browser settings.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'The request to get user location timed out.';
                    break;
            }
            setDirectionsStatus({ loading: false, error: errorMessage });
        }
    );
  };


  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (error || !venue) {
    return <div className="text-center py-20 text-red-600">{error || 'Venue not found.'}</div>;
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{venue.name}</h1>
          <div className="flex flex-wrap items-center mt-3 text-gray-600 gap-x-4 gap-y-2">
            <div className="flex items-center">
              <LocationPinIcon className="w-5 h-5 mr-1.5" />
              <span>{venue.location}</span>
            </div>
            <div className="flex items-center">
              <StarRating rating={venue.rating} />
              <span className="ml-2 text-sm">{venue.rating.toFixed(1)} ({venue.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Main Column */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {selectedImage && (
                <div className="mb-8">
                    <div className="relative mb-4">
                        <img src={selectedImage} alt={venue.name} className="w-full h-96 md:h-[500px] object-cover rounded-xl shadow-lg bg-gray-200" />
                    </div>
                    {venue.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-3">
                            {venue.images.slice(0, 5).map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`block rounded-lg overflow-hidden focus:outline-none transition-all duration-200 ${selectedImage === img ? 'ring-4 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}`}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${venue.name} thumbnail ${index + 1}`}
                                        className="w-full h-24 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            <div className="space-y-8">
                {venue.about && (
                    <div className="border-b pb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">About this venue</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{venue.about}</p>
                    </div>
                )}
               
               {venue.amenities && venue.amenities.length > 0 && (
                <div className="border-b pb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
                        {venue.amenities.map(amenity => (
                            <div key={amenity} className="flex items-center">
                                {getAmenityIcon(amenity)}
                                <span className="ml-3 text-gray-700 font-medium">{amenity}</span>
                            </div>
                        ))}
                    </div>
                </div>
                )}

               <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sports Available</h2>
                 <div className="flex flex-wrap gap-2">
                  {venue.sports.length > 0 ? venue.sports.map(sport => (
                    <div key={sport} className="bg-primary-light text-primary font-semibold px-3 py-1 rounded-full text-sm capitalize">
                      {sport}
                    </div>
                  )) : (
                    <p className="text-gray-500">No specific sports listed for this venue.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
          {/* Right/Sidebar Column */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                   {venue.pricePerHour && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Starts from</p>
                            <p className="text-4xl font-bold text-accent">₹{venue.pricePerHour}<span className="text-lg font-normal text-gray-500">/hr</span></p>
                        </div>
                   )}
                   <p className="text-gray-600 mb-4">Ready to play? Book your slot now!</p>
                   <button 
                    onClick={() => navigate(`/book/${venue.id}`)}
                    className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300">
                        Book This Venue
                    </button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Venue Information</h3>
                     <div className="space-y-3 text-sm">
                        <div className="flex items-start">
                            <ClockIcon className="w-5 h-5 text-gray-500 mt-0.5 mr-3 shrink-0" />
                            <div>
                                <span className="font-semibold text-gray-800">Hours: </span>
                                {venue.operatingHours ? (
                                    <span className="text-gray-600">{venue.operatingHours}</span>
                                ) : (
                                    <span className="text-gray-500 italic">Not available</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start">
                            <PhoneIcon className="w-5 h-5 text-gray-500 mt-0.5 mr-3 shrink-0" />
                             <div>
                                <span className="font-semibold text-gray-800">Phone: </span>
                                {venue.phone ? (
                                    <a href={`tel:${venue.phone}`} className="text-primary hover:underline">{venue.phone}</a>
                                ) : (
                                    <span className="text-gray-500 italic">Not available</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start">
                            <GlobeAltIcon className="w-5 h-5 text-gray-500 mt-0.5 mr-3 shrink-0" />
                            <div>
                                <span className="font-semibold text-gray-800">Website: </span>
                                 {venue.website ? (
                                    <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{venue.website}</a>
                                 ): (
                                    <span className="text-gray-500 italic">Not available</span>
                                 )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Location & Directions</h3>
                    <div className="w-full h-60 bg-gray-300 rounded-lg overflow-hidden mb-4">
                       <iframe
                            title={`Map of ${venue.name}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${venue.lat},${venue.lon}&z=14&output=embed&hl=en`}>
                        </iframe>
                    </div>
                     <button
                        onClick={handleGetDirections}
                        disabled={directionsStatus.loading}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50">
                        <NavigationIcon className="w-5 h-5 text-primary" />
                        {directionsStatus.loading ? 'Locating...' : 'Get Directions'}
                    </button>
                    {directionsStatus.error && <p className="text-red-500 text-xs mt-2 text-center">{directionsStatus.error}</p>}
                </div>
             </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Player Reviews (Sample)</h2>
          <div className="space-y-6">
            {REVIEWS.map(review => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <img src={review.user.avatar} alt={review.user.fullName} className="w-12 h-12 rounded-full mr-4" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center flex-wrap">
                      <div>
                        <p className="font-semibold text-gray-800">{review.user.fullName}</p>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-sm text-gray-500 mt-1 sm:mt-0">{review.date}</p>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
