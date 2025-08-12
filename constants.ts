import { Venue, Sport, Booking, User, Review, ChatMessage, Event, Lobby, Match, PlayerStats } from './types';

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
    { name: 'Box Cricket', image: 'image/boxcricket.jpg' },
    { name: 'Football', image: 'image/football.jpg' },
    { name: 'Badminton', image: 'image/badminton-court.jpg' },
    { name: 'Pickleball', image: 'image/pickle.png' },
    { name: 'Cricket Nets', image: 'image/cricketnet.jpeg' },
    { name: 'Tennis', image: 'image/tennis.jpg' },
    { name: 'Table Tennis', image: 'image/table-tennis.jpg' }
];

export const MOCK_VENUES: Venue[] = [
  {
    id: 'mock-1',
    name: 'Ace Badminton Club',
    location: 'Koramangala, Bengaluru',
    rating: 4.9,
    reviewCount: 215,
    sports: ['Badminton'],
    images: ['https://images.unsplash.com/photo-1521587522486-08105d4b0f3e?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626244243164-32a26b17c26d?q=80&w=800&auto=format&fit=crop'],
    pricePerHour: 450,
    lat: 12.935,
    lon: 77.625,
    venueType: 'indoor',
    status: 'approved',
  },
  {
    id: 'mock-2',
    name: 'The Football Arena',
    location: 'Jubilee Hills, Hyderabad',
    rating: 4.7,
    reviewCount: 180,
    sports: ['Football', 'Box Cricket'],
    images: ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1551958214-2d5b2447e38c?q=80&w=800&auto=format&fit=crop'],
    pricePerHour: 1500,
    lat: 17.43,
    lon: 78.4,
    venueType: 'outdoor',
    status: 'approved',
  },
  {
    id: 'mock-3',
    name: 'Smash & Serve Sports Complex',
    location: 'Andheri, Mumbai',
    rating: 4.6,
    reviewCount: 302,
    sports: ['Tennis', 'Table Tennis'],
    images: ['https://images.unsplash.com/photo-1554065248-13ce328c8324?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1558923383-ed93b11ead9b?q=80&w=800&auto=format&fit=crop'],
    pricePerHour: 600,
    lat: 19.12,
    lon: 72.88,
    venueType: 'mixed',
    status: 'approved',
  },
  {
    id: 'mock-4',
    name: 'Hoops Nation Basketball',
    location: 'Anna Nagar, Chennai',
    rating: 4.8,
    reviewCount: 164,
    sports: ['Basketball'],
    images: ['https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1608245449242-42c81b25a417?q=80&w=800&auto=format&fit=crop'],
    pricePerHour: 800,
    lat: 13.08,
    lon: 80.22,
    venueType: 'indoor',
    status: 'approved',
  },
  {
    id: 'mock-pending-1',
    name: 'New Wave Swimming Academy',
    location: 'Banjara Hills, Hyderabad',
    rating: 0,
    reviewCount: 0,
    sports: ['Swimming'],
    images: ['https://images.unsplash.com/photo-1559022452-a32d73b2d18f?q=80&w=800&auto=format&fit=crop'],
    pricePerHour: 350,
    lat: 17.41,
    lon: 78.44,
    venueType: 'outdoor',
    status: 'pending',
    submittedBy: 'f1',
  },
  {
    id: 'mock-pending-2',
    name: 'The Cricket Dome',
    location: 'Pune, Maharashtra',
    rating: 0,
    reviewCount: 0,
    sports: ['Cricket'],
    images: ['https://images.unsplash.com/photo-1599422061910-60875b11f26b?q=80&w=800&auto=format&fit=crop'],
    pricePerHour: 1800,
    lat: 18.52,
    lon: 73.85,
    venueType: 'indoor',
    status: 'pending',
    submittedBy: 'f1',
  }
];

export const AMENITIES: string[] = [
    'Parking', 'Restroom', 'Refreshments', 'CCTV Surveillance', 'First Aid',
    'Locker Room', 'Showers', 'WiFi', 'Seating Area', 'Floodlights'
];

export const MOCK_USERS: User[] = [
    { id: 'u1', fullName: 'Alex Morgan', email: 'alex.morgan@example.com', avatar: 'https://i.pravatar.cc/150?u=alexmorgan', role: 'user', medals: [], status: 'active' },
    { id: 'u2', fullName: 'Jane Doe', email: 'jane.doe@example.com', avatar: 'https://i.pravatar.cc/150?u=jane', role: 'user', medals: [], status: 'active' },
    { id: 'u3', fullName: 'Mike Ross', email: 'mike.ross@example.com', avatar: 'https://i.pravatar.cc/150?u=mike', role: 'user', medals: [], status: 'active' },
    { id: 'u4', fullName: 'Sarah Connor', email: 'sarah.connor@example.com', avatar: 'https://i.pravatar.cc/150?u=sarah', role: 'user', medals: [], status: 'banned' }
];

export const MOCK_USER: User = MOCK_USERS[0];

export const MOCK_FACILITATOR: User = {
    id: 'f1',
    fullName: 'Chris Johnson',
    email: 'chris.j@venuepro.com',
    avatar: 'https://i.pravatar.cc/150?u=chrisjohnson',
    role: 'facilitator',
    status: 'active'
};

export const MOCK_ADMIN: User = {
    id: 'admin1',
    fullName: 'Admin User',
    email: 'admin@quickcourt.com',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    role: 'admin',
    status: 'active'
};

export const MOCK_ALL_USERS: User[] = [...MOCK_USERS, MOCK_FACILITATOR, MOCK_ADMIN];


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
        status: 'Confirmed',
        numberOfPlayers: 2
    },
];

export const MOCK_EVENTS: Event[] = [
    {
        id: 'evt1',
        name: 'Summer Badminton Championship',
        sport: 'Badminton',
        venue: { id: 'mock-1', name: 'Ace Badminton Club', location: 'Koramangala, Bengaluru' },
        date: '2025-07-12',
        startTime: '09:00',
        prizePool: 50000,
        entryFee: 500,
        format: 'Singles Knockout',
        participants: 28,
        maxParticipants: 64,
        image: 'https://images.unsplash.com/photo-1576481363293-1a2c3327123a?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 'evt2',
        name: 'Monsoon Football 5s League',
        sport: 'Football',
        venue: { id: 'mock-2', name: 'The Football Arena', location: 'Jubilee Hills, Hyderabad' },
        date: '2025-07-20',
        startTime: '10:00',
        prizePool: 75000,
        entryFee: 2500,
        format: '5-a-side Round Robin',
        participants: 10,
        maxParticipants: 16,
        image: 'https://images.unsplash.com/photo-1595152772023-b68c9869275a?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 'evt3',
        name: 'Weekend Tennis Open',
        sport: 'Tennis',
        venue: { id: 'mock-3', name: 'Smash & Serve Sports Complex', location: 'Andheri, Mumbai' },
        date: '2025-08-03',
        startTime: '11:00',
        prizePool: 30000,
        entryFee: 750,
        format: 'Doubles Elimination',
        participants: 14,
        maxParticipants: 32,
        image: 'https://images.unsplash.com/photo-1560089017-a38092a8a436?q=80&w=800&auto=format&fit=crop',
    }
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

const lobbyMatches: Match[] = [
    { id: 'm1', date: '2025-06-20', sport: 'Badminton', participants: ['Alex Morgan', 'Jane Doe'], winner: 'Alex Morgan', score: '21-18' },
    { id: 'm2', date: '2025-06-18', sport: 'Badminton', participants: ['Mike Ross', 'Sarah Connor'], winner: 'Sarah Connor', score: '21-15' },
];

const lobbyChat: ChatMessage[] = [
    { id: 'lc1', user: MOCK_USERS[1], text: "Who's up for a game this weekend?", timestamp: "Yesterday" },
    { id: 'lc2', user: MOCK_USERS[0], text: "I'm in! Badminton on Saturday?", timestamp: "Yesterday" },
    { id: 'lc3', user: MOCK_USERS[2], text: "Sounds good! I can join.", timestamp: "Today" },
];

const badmintonLegendsStats: PlayerStats[] = [
    { playerName: 'Alex Morgan', matchesPlayed: 1, wins: 1, losses: 0, draws: 0 },
    { playerName: 'Jane Doe', matchesPlayed: 1, wins: 0, losses: 1, draws: 0 },
    { playerName: 'Mike Ross', matchesPlayed: 1, wins: 0, losses: 1, draws: 0 },
    { playerName: 'Sarah Connor', matchesPlayed: 1, wins: 1, losses: 0, draws: 0 },
];

const footballFanaticsStats: PlayerStats[] = [
    { playerName: 'Alex Morgan', matchesPlayed: 1, wins: 0, losses: 1, draws: 0 },
    { playerName: 'Jane Doe', matchesPlayed: 1, wins: 1, losses: 0, draws: 0 },
    { playerName: 'Mike Ross', matchesPlayed: 1, wins: 0, losses: 1, draws: 0 },
    { playerName: 'Sarah Connor', matchesPlayed: 1, wins: 1, losses: 0, draws: 0 },
];


export const MOCK_LOBBIES: Lobby[] = [
    {
        id: 'lobby1',
        name: 'Badminton Legends',
        description: 'Weekly badminton crew. All skill levels welcome!',
        avatar: 'https://images.unsplash.com/photo-1558923383-ed93b11ead9b?q=80&w=400',
        adminId: 'u1',
        members: ['Alex Morgan', 'Jane Doe', 'Mike Ross', 'Sarah Connor'],
        matches: lobbyMatches,
        chat: lobbyChat,
        stats: badmintonLegendsStats,
    },
    {
        id: 'lobby2',
        name: 'Football Fanatics',
        description: 'Weekend 5-a-side football matches.',
        avatar: 'https://images.unsplash.com/photo-1551958214-2d5b2447e38c?q=80&w=400',
        adminId: 'u2',
        members: ['Alex Morgan', 'Jane Doe', 'Mike Ross', 'Sarah Connor'],
        matches: [
            { 
                id: 'm3', 
                date: '2025-06-22', 
                sport: 'Football', 
                teamA: ['Alex Morgan', 'Mike Ross'], 
                teamB: ['Jane Doe', 'Sarah Connor'],
                winningTeam: 'Team B',
                score: '2-4'
            },
        ],
        chat: [
            { id: 'lc4', user: MOCK_USERS[1], text: "We need one more for this Sunday's game!", timestamp: "10:30 AM" }
        ],
        stats: footballFanaticsStats,
    }
];