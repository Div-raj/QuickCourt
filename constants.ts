
import { Venue, Sport, Booking, User, Review, ChatMessage } from './types';

export const SPORT_CATEGORIES: Record<string, string> = {
    'Sports Centre': 'sport.sports_centre',
    'Stadium': 'sport.stadium',
    'Tennis Court': 'sport.tennis',
    'Badminton Court': 'sport.badminton',
    'Swimming Pool': 'sport.swimming_pool',
    'Golf Course': 'sport.golf',
    'Football Pitch': 'sport.pitch.football',
    'Basketball Pitch': 'sport.pitch.basketball',
};

export const SPORTS: Sport[] = [
    { name: 'Box Cricket', image: 'https://firebasestorage.googleapis.com/v0/b/ai-apps-404505.appspot.com/o/projects%2F-Nxg8rFpA_3jPKAxYd4r%2Fboxcricket.png?alt=media&token=24838641-61a7-471a-86a3-c5292c01990c' },
    { name: 'Football', image: 'https://firebasestorage.googleapis.com/v0/b/ai-apps-404505.appspot.com/o/projects%2F-Nxg8rFpA_3jPKAxYd4r%2Ffootball.png?alt=media&token=c6d7c86a-5c53-4018-80e2-6395358f2bf5' },
    { name: 'Badminton', image: 'https://firebasestorage.googleapis.com/v0/b/ai-apps-404505.appspot.com/o/projects%2F-Nxg8rFpA_3jPKAxYd4r%2Fbadminton.png?alt=media&token=e9c15852-9bbf-4f51-87a4-c08169977800' },
    { name: 'Pickleball', image: 'https://firebasestorage.googleapis.com/v0/b/ai-apps-404505.appspot.com/o/projects%2F-Nxg8rFpA_3jPKAxYd4r%2Fpickleball.png?alt=media&token=35064e62-4309-4074-91f6-55a013d33973' },
    { name: 'Cricket Nets', image: 'https://firebasestorage.googleapis.com/v0/b/ai-apps-404505.appspot.com/o/projects%2F-Nxg8rFpA_3jPKAxYd4r%2Fcricket.png?alt=media&token=5447b5c8-1a5c-4340-a548-d3e9d12a868a' },
    { name: 'Tennis', image: 'https://firebasestorage.googleapis.com/v0/b/ai-apps-404505.appspot.com/o/projects%2F-Nxg8rFpA_3jPKAxYd4r%2Ftennis.png?alt=media&token=a8e0f951-6453-4888-81e0-74f4625b597c' },
    { name: 'Table Tennis', image: 'https://firebasestorage.googleapis.com/v0/b/ai-apps-404505.appspot.com/o/projects%2F-Nxg8rFpA_3jPKAxYd4r%2Ftabletennis.png?alt=media&token=c6c51845-6323-42e1-953b-e0cb4f552f52' }
];

export const AMENITIES: string[] = [
    'Parking', 'Restroom', 'Refreshments', 'CCTV Surveillance', 'First Aid',
    'Locker Room', 'Showers', 'WiFi', 'Seating Area', 'Floodlights'
];

export const MOCK_USER: User = {
    id: 'u1',
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alexmorgan',
    role: 'user'
};

export const MOCK_FACILITATOR: User = {
    id: 'f1',
    fullName: 'Chris Johnson',
    email: 'chris.j@venuepro.com',
    avatar: 'https://i.pravatar.cc/150?u=chrisjohnson',
    role: 'facilitator'
};

export const REVIEWS: Review[] = [
    {
        id: 'r1',
        user: { fullName: 'Alex Morgan', avatar: 'https://i.pravatar.cc/150?u=alexmorgan' },
        rating: 5,
        comment: 'Fantastic courts, very well maintained. The booking process was super smooth as well. Highly recommended!',
        date: '18 June 2025, 5:30 PM'
    },
    {
        id: 'r2',
        user: { fullName: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=jane' },
        rating: 4,
        comment: 'Good facilities, but it can get a bit crowded on weekends. Best to book in advance. The lighting is excellent for evening games.',
        date: '15 June 2025, 2:00 PM'
    },
];

export const BOOKINGS: Booking[] = [
    {
        id: 'b1',
        venue: { id: '2', name: 'Urban Sports Hub', location: 'Rajkot, Gujarat' },
        court: { id: 'c4', name: 'Badminton Court A', pricePerHour: 300 },
        date: '2025-06-18',
        startTime: '17:00',
        endTime: '18:00',
        totalPrice: 300,
        status: 'Confirmed'
    },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    {
        id: 'cm1',
        user: { fullName: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=jane' },
        text: 'Anyone up for a game of badminton tomorrow evening at Urban Sports Hub?',
        timestamp: '10:30 AM',
    },
    {
        id: 'cm2',
        user: { fullName: 'Mike Ross', avatar: 'https://i.pravatar.cc/150?u=mike' },
        text: 'Looking for a +1 for football at PowerPlay Turf this weekend. We need a striker!',
        timestamp: '10:32 AM',
    },
    {
        id: 'cm3',
        user: { fullName: 'Alex Morgan', avatar: 'https://i.pravatar.cc/150?u=alexmorgan' },
        text: "Just booked a tennis court for Friday 6 PM. Need a partner for a friendly match. Let me know if you're interested!",
        timestamp: '10:45 AM',
    }
];