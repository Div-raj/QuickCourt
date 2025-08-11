
import { Venue, GeoapifyPlace } from '../types';
import { SPORTS, AMENITIES } from '../constants';

const simpleHash = (str: string): number => {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

// A much larger, curated map of high-quality images for different sport categories to ensure variety.
const SPORT_IMAGE_MAP: Record<string, string[]> = {
    football: [
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551958214-2d5b2447e38c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606016154238-125091174983?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1527299542910-651030041d8b?q=80&w=800&auto=format&fit=crop',
    ],
    basketball: [
        'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608245449242-42c81b25a417?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577495540029-93a5049d7580?q=80&w=800&auto=format&fit=crop',
    ],
    tennis: [
        'https://images.unsplash.com/photo-1554065248-13ce328c8324?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594470117722-de4b9a021d3d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1585932414849-3c7f66a7a119?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1622207297291-de600c3c5496?q=80&w=800&auto=format&fit=crop',
    ],
    badminton: [
        'https://images.unsplash.com/photo-1521587522486-08105d4b0f3e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1626244243164-32a26b17c26d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558923383-ed93b11ead9b?q=80&w=800&auto=format&fit=crop',
    ],
    swimming: [
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1559022452-a32d73b2d18f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590794055428-2e86ab0b3367?q=80&w=800&auto=format&fit=crop',
    ],
    golf: [
        'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598587138722-895855a87b89?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500930287096-c1870624f2dc?q=80&w=800&auto=format&fit=crop',
    ],
    cricket: [
        'https://images.unsplash.com/photo-1599422061910-60875b11f26b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1607921543911-331a4037595b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1593340087342-84f914682413?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1624897174246-015f6b9b8061?q=80&w=800&auto=format&fit=crop',
    ],
    stadium: [
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590214298453-ac7c6df44929?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1595155823951-6d460d3c898c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1576481363293-1a2c3327123a?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1627964951010-a7b3734e06f9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515523110825-941c034ccc84?q=80&w=800&auto=format&fit=crop',
    ],
    sports_centre: [
        'https://images.unsplash.com/photo-1587635299463-c712de1083e4?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1565741569337-775c2b01c3b3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518063339097-404c7b897f0d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542500186-6edb30655a42?q=80&w=800&auto=format&fit=crop',
    ],
    gym: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop',
    ],
    default: [
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484482340112-e1e2682b4856?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1471295253337-3ceaa6780b43?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1562088237-143e1750e609?q=80&w=800&auto=format&fit=crop',
    ]
};

// Returns an array of images for a given sport category, deterministically shuffled
const getSportImages = (categories: string[], placeId: string): string[] => {
    const catString = categories.join(' ').toLowerCase();
    const hash = simpleHash(placeId);

    const pickMultipleFrom = (key: keyof typeof SPORT_IMAGE_MAP, count: number = 5): string[] => {
        const images = SPORT_IMAGE_MAP[key] || SPORT_IMAGE_MAP.default;
        // Deterministic "shuffling" by picking a start index
        const startIndex = hash % images.length;
        const result = [];
        for (let i = 0; i < images.length; i++) {
            result.push(images[(startIndex + i) % images.length]);
        }
        return result.slice(0, Math.min(count, images.length));
    };
    
    // Prioritize more specific categories first
    if (catString.includes('football') || catString.includes('soccer')) return pickMultipleFrom('football');
    if (catString.includes('basketball')) return pickMultipleFrom('basketball');
    if (catString.includes('tennis')) return pickMultipleFrom('tennis');
    if (catString.includes('badminton')) return pickMultipleFrom('badminton');
    if (catString.includes('swimming')) return pickMultipleFrom('swimming');
    if (catString.includes('golf')) return pickMultipleFrom('golf');
    if (catString.includes('cricket')) return pickMultipleFrom('cricket');
    if (catString.includes('gym')) return pickMultipleFrom('gym');
    // Differentiate between a general multi-sport center and a large stadium
    if (catString.includes('sports_centre')) return pickMultipleFrom('sports_centre');
    if (catString.includes('stadium') || catString.includes('arena')) return pickMultipleFrom('stadium');
    
    return pickMultipleFrom('default');
};


// Create a mapping from OSM facility keys to our app's Amenity names
const FACILITY_MAP: { [key: string]: string } = {
    parking: 'Parking',
    toilets: 'Restroom',
    food: 'Refreshments',
    vending_machine: 'Refreshments',
    cctv: 'CCTV Surveillance',
    'surveillance:type:cctv': 'CCTV Surveillance',
    lockers: 'Locker Room',
    shower: 'Showers',
    internet_access: 'WiFi',
    'internet_access:wlan': 'WiFi',
    bench: 'Seating Area',
    'sport:floodlit': 'Floodlights',
    first_aid: 'First Aid',
    'lit': 'Floodlights',
};

export const transformGeoapifyPlaceToVenue = (place: GeoapifyPlace): Venue => {
    const props = place.properties;
    const rawCategories = props.categories || [];
    const safeCategories = rawCategories.filter((c): c is string => typeof c === 'string' && c.length > 0);
    const hash = simpleHash(props.place_id);

    const name = props.name || props.address_line1 || 'Unnamed Venue';
    const location = props.formatted || 'Location not available';

    // 1. Image: Prioritize real image, then generate a list of relevant fallback images.
    const realImage = props.wiki_and_media?.image || props.datasource?.raw?.image;
    const fallbackImages = getSportImages(safeCategories, props.place_id);
    
    // Ensure the real image is first, and the rest are unique fallbacks.
    const images = realImage 
        ? [realImage, ...fallbackImages.filter(img => img !== realImage)] 
        : fallbackImages;
    
    // 2. About/Description: Use Wikipedia description if available, otherwise generate a fallback.
    const about = props.wiki_and_media?.description || `A popular spot for local sports enthusiasts, ${name} is located conveniently in ${props.city || 'the area'}. This venue is known for its well-maintained facilities and welcoming atmosphere, making it ideal for both casual games and serious training.`;

    // 3. Contact Info
    const website = props.contact?.website || props.website || props.datasource?.raw?.website;
    const phone = props.contact?.phone || props.phone || props.datasource?.raw?.phone;

    // 4. Operating Hours
    const operatingHours = props.opening_hours || props.datasource?.raw?.["opening_hours"];
    
    // 5. Amenities: Map from real data in 'facilities' and 'datasource.raw'. No mocking.
    const realAmenities = new Set<string>();
    const allPotentialAmenities: { [key: string]: string | undefined } = {
        ...(props.datasource?.raw || {}),
        ...(props.facilities || {}),
    };

    for (const key in allPotentialAmenities) {
        const value = allPotentialAmenities[key];
        if (value && value !== 'no' && value !== 'false') {
            const mappedAmenity = FACILITY_MAP[key];
            if (mappedAmenity) {
                realAmenities.add(mappedAmenity);
            }
        }
    }

    // 6. Sports
    let sports = new Set<string>();
    // From categories
    safeCategories.map(c => c.replace('sport.', '').replace(/_/g, ' ')).forEach(s => sports.add(s));
    // From raw OSM tags
    if (props.datasource.raw?.sport) {
        props.datasource.raw.sport.split(';').map(s => s.trim().replace(/_/g, ' ')).forEach(s => sports.add(s));
    }
    // Clean up
    let sportList = Array.from(sports).filter(s => s && s !== 'sports centre' && s !== 'stadium' && s !== 'pitch' && s !== 'leisure');
    if (sportList.length === 0) {
        sportList = ['General Sports']; // Fallback
    }

    // 7. Venue Type (Inference)
    const lowerCaseName = name.toLowerCase();
    const lowerCaseCategories = safeCategories.join(' ').toLowerCase();
    let venueType: 'indoor' | 'outdoor' | 'mixed' = 'mixed';
    if (lowerCaseName.includes('indoor')) venueType = 'indoor';
    else if (lowerCaseName.includes('outdoor')) venueType = 'outdoor';
    else if (lowerCaseCategories.includes('badminton') || lowerCaseCategories.includes('squash') || lowerCaseCategories.includes('table_tennis') || lowerCaseCategories.includes('gym')) venueType = 'indoor';
    else if (lowerCaseCategories.includes('golf') || lowerCaseCategories.includes('pitch')) venueType = 'outdoor';
    else {
        const types: ('indoor' | 'outdoor' | 'mixed')[] = ['indoor', 'outdoor', 'mixed'];
        venueType = types[hash % 3];
    }
    
    // 8. Price (Mocked, as this data is not reliably available)
    const pricePerHour = 300 + (hash % 20) * 50;
    
    return {
        id: props.place_id,
        name,
        location,
        lat: props.lat,
        lon: props.lon,
        // Rating and reviews are not provided by Geoapify, so they remain mocked for demonstration.
        rating: 3.5 + (hash % 16) / 10,
        reviewCount: Math.floor(hash % 151) + 5,
        pricePerHour: pricePerHour,
        amenities: Array.from(realAmenities), // Only use real amenities from the data
        images: images,
        sports: sportList.map(s => s.charAt(0).toUpperCase() + s.slice(1)), // Capitalize
        about: about,
        operatingHours: operatingHours,
        website: website,
        phone: phone,
        status: 'approved',
        venueType,
    };
};
