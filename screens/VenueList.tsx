import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Venue, GeoapifyPlace } from '../types';
import { SPORT_CATEGORIES } from '../constants';
import { GEOAPIFY_API_KEY } from '../config';
import VenueCard from '../components/VenueCard';
import { SearchIcon, LocationPinIcon } from '../components/icons';
import { transformGeoapifyPlaceToVenue } from '../utils/dataTransformers';

const LocationAutocomplete: React.FC<{ onSelectLocation: (lat: number, lon: number) => void }> = ({ onSelectLocation }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<any>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (value.length > 2) {
            timeoutRef.current = setTimeout(() => {
                fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${GEOAPIFY_API_KEY}`)
                    .then(res => res.json())
                    .then(data => {
                        setSuggestions(data.features || []);
                        setIsOpen(true);
                    })
                    .catch(err => console.error(err));
            }, 300);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelectSuggestion = (suggestion: any) => {
        setSearchTerm(suggestion.properties.formatted);
        onSelectLocation(suggestion.properties.lat, suggestion.properties.lon);
        setSuggestions([]);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <input 
                type="text" 
                placeholder="Search by city, address, or landmark..." 
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition text-secondary" />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((s) => (
                        <li key={s.properties.place_id} 
                            onClick={() => handleSelectSuggestion(s)}
                            className="p-3 hover:bg-accent/10 hover:text-accent cursor-pointer border-b last:border-b-0 text-secondary transition-colors">
                            {s.properties.formatted}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const FilterSidebar: React.FC<{ 
    selectedCategories: string[]; 
    onCategoryChange: (category: string) => void;
    venueTypeFilter: 'all' | 'indoor' | 'outdoor';
    onVenueTypeChange: (type: 'all' | 'indoor' | 'outdoor') => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    onUseLocation: () => void; 
    isLocating: boolean;
}> = ({ selectedCategories, onCategoryChange, venueTypeFilter, onVenueTypeChange, onApplyFilters, onClearFilters, onUseLocation, isLocating }) => (
    <div className="w-full lg:w-1/4 lg:pr-8">
        <div className="bg-surface p-6 rounded-xl shadow-lg-soft border border-border/50 sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-secondary">Filters</h3>
            
            <div className="mb-6">
                <h4 className="font-semibold mb-3 text-secondary">Location</h4>
                <button 
                    onClick={onUseLocation} 
                    disabled={isLocating}
                    className="w-full flex items-center justify-center bg-accent/10 text-accent font-semibold py-2.5 px-4 rounded-lg hover:bg-accent/20 transition-all disabled:opacity-50 disabled:cursor-wait">
                    <LocationPinIcon className="w-5 h-5 mr-2" />
                    {isLocating ? 'Locating...' : 'Use My Current Location'}
                </button>
                 <p className="text-xs text-secondary/60 mt-2 text-center">Searches for venues within a 10km radius.</p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-3 text-secondary">Venue Type</h4>
                <fieldset className="space-y-2">
                    <legend className="sr-only">Venue Type</legend>
                     {(['all', 'indoor', 'outdoor'] as const).map(type => (
                         <div key={type} className="flex items-center">
                            <input
                                id={`type-${type}`}
                                name="venueType"
                                type="radio"
                                value={type}
                                checked={venueTypeFilter === type}
                                onChange={() => onVenueTypeChange(type)}
                                className="h-4 w-4 text-accent focus:ring-accent border-gray-300"
                            />
                            <label htmlFor={`type-${type}`} className="ml-3 text-sm text-secondary cursor-pointer capitalize">{type}</label>
                        </div>
                    ))}
                </fieldset>
            </div>
            
            <div className="mb-6">
                <h4 className="font-semibold mb-3 text-secondary">Sport Category</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {Object.entries(SPORT_CATEGORIES).map(([name, code]) => (
                        <div key={code} className="flex items-center">
                            <input
                                id={`cat-${code}`}
                                type="checkbox"
                                value={code}
                                checked={selectedCategories.includes(code)}
                                onChange={() => onCategoryChange(code)}
                                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                            />
                            <label htmlFor={`cat-${code}`} className="ml-3 text-sm text-secondary cursor-pointer">{name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <button onClick={onApplyFilters} className="w-full bg-accent text-white py-2.5 rounded-lg font-bold hover:bg-accent-dark transition-colors shadow-lg-accent">Apply Filters</button>
                <button onClick={onClearFilters} className="w-full mt-2 text-secondary py-2 rounded-md hover:bg-secondary/10 transition-colors">Clear Filters</button>
            </div>
        </div>
    </div>
);

const VenueList: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{lat: number, lon: number} | null>({ lat: 23.0225, lon: 72.5714 }); // Default
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['sport.sports_centre', 'sport.stadium']);
    const [venueTypeFilter, setVenueTypeFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };
    
    const handleVenueTypeChange = (type: 'all' | 'indoor' | 'outdoor') => {
        setVenueTypeFilter(type);
    };

    const fetchVenues = async (currentLocation: {lat: number, lon: number} | null, categories: string[]) => {
        if (!currentLocation || categories.length === 0) {
            setVenues([]);
            setLoading(false);
            return;
        };

        setLoading(true);
        setError(null);

        const categoryFilter = categories.join(',');
        const filter = `circle:${currentLocation.lon},${currentLocation.lat},10000`; // 10km radius
        const limit = 40;
        const apiKey = GEOAPIFY_API_KEY;

        try {
            const res = await fetch(`https://api.geoapify.com/v2/places?categories=${categoryFilter}&filter=${filter}&limit=${limit}&apiKey=${apiKey}`);
            if (!res.ok) throw new Error('Failed to fetch venues from Geoapify.');
            
            const data = await res.json();
            const transformedVenues = data.features.map((place: GeoapifyPlace) => transformGeoapifyPlaceToVenue(place));
            
            setVenues(transformedVenues);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleGetUserLocation = async () => {
        setIsLocating(true);
        setError(null);
        try {
            const res = await fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${GEOAPIFY_API_KEY}`);
            if (!res.ok) {
                throw new Error("Failed to fetch location from IP address. The service might be temporarily unavailable.");
            }
            const data = await res.json();
            
            if (data.location?.latitude && data.location?.longitude) {
                const newLocation = {
                    lat: data.location.latitude,
                    lon: data.location.longitude
                };
                setLocation(newLocation);
                fetchVenues(newLocation, selectedCategories);
            } else {
                throw new Error("Could not determine location from your network. Please try searching manually.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Could not get your location. Please try searching manually.');
        } finally {
            setIsLocating(false);
        }
    };
    
    useEffect(() => {
        if(location) fetchVenues(location, selectedCategories);
    }, []);

    const handleApplyFilters = () => {
        if(location) fetchVenues(location, selectedCategories);
    }
    
    const handleClearFilters = () => {
        const clearedCategories: string[] = [];
        setSelectedCategories(clearedCategories);
        setVenueTypeFilter('all');
        if (location) {
            fetchVenues(location, clearedCategories);
        }
    }

    const handleLocationSelect = (lat: number, lon: number) => {
        const newLocation = { lat, lon };
        setLocation(newLocation);
        fetchVenues(newLocation, selectedCategories);
    }
    
    const filteredVenues = venues.filter(venue => {
        if (venueTypeFilter === 'all') return true;
        if (venueTypeFilter === 'indoor') return venue.venueType === 'indoor' || venue.venueType === 'mixed';
        if (venueTypeFilter === 'outdoor') return venue.venueType === 'outdoor' || venue.venueType === 'mixed';
        return true;
    });

    return (
        <div className="bg-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-secondary">Find & Book Sports Venues</h1>
                    <p className="text-secondary/70 mt-2 max-w-2xl mx-auto">Discover real-world stadiums, courts, and sports centers near you. Use the filters to find your perfect spot.</p>
                    <div className="mt-6 max-w-xl mx-auto">
                        <LocationAutocomplete onSelectLocation={handleLocationSelect} />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row">
                    <FilterSidebar 
                        selectedCategories={selectedCategories} 
                        onCategoryChange={handleCategoryChange}
                        venueTypeFilter={venueTypeFilter}
                        onVenueTypeChange={handleVenueTypeChange}
                        onApplyFilters={handleApplyFilters}
                        onClearFilters={handleClearFilters}
                        onUseLocation={handleGetUserLocation}
                        isLocating={isLocating}
                    />
                    <div className="w-full lg:w-3/4 lg:pl-4 mt-8 lg:mt-0">
                        {loading ? (
                             <div className="flex justify-center items-center h-96">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent"></div>
                             </div>
                        ) : error ? (
                            <div className="text-center py-10 px-4 bg-red-50 text-red-700 rounded-lg">
                                <h3 className="font-bold">An Error Occurred</h3>
                                <p>{error}</p>
                            </div>
                        ) : filteredVenues.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredVenues.map(venue => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-10 px-4 bg-surface text-secondary/80 rounded-lg shadow-lg-soft">
                                <h3 className="font-bold text-secondary text-lg">No Venues Found</h3>
                                <p>Try adjusting your filters, searching for a different location, or selecting more categories.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueList;