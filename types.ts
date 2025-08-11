import type React from 'react';

export interface Sport {
  name: string;
  image: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: 'user' | 'owner' | 'admin' | 'facilitator';
}

export interface Amenity {
  name:string;
  icon: React.ReactNode;
}

export interface Review {
  id: string;
  user: Pick<User, 'fullName' | 'avatar'>;
  rating: number;
  comment: string;
  date: string;
}

export interface Court {
  id:string;
  name: string;
  pricePerHour: number;
}

export interface Venue {
  id: string; // will be place_id
  name: string;
  location: string; // will be formatted address
  rating: number; // will be mocked
  reviewCount: number; // will be mocked
  sports: string[]; // will be categories
  images: string[]; // can be mocked or from submission
  pricePerHour?: number; // make optional
  amenities?: string[];
  about?: string;
  operatingHours?: string; // from opening_hours
  courts?: Court[]; // make optional
  website?: string;
  phone?: string;
  lat: number;
  lon: number;
  status?: 'pending' | 'approved' | 'rejected'; // For facilitator submissions
  submittedBy?: string; // Facilitator's user ID
  venueType?: 'indoor' | 'outdoor' | 'mixed';
}


export interface Booking {
  id: string;
  venue: Pick<Venue, 'id' | 'name' | 'location'>;
  court?: Court; // Court is now optional
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'Confirmed' | 'Cancelled';
}

export enum AuthScreenType {
  Login = 'login',
  SignUp = 'signup',
  Verify = 'verify'
}

export interface GeoapifyPlace {
  properties: {
    name?: string;
    address_line1: string;
    address_line2: string;
    categories: string[];
    city: string;
    country: string;
    formatted: string;
    lat: number;
    lon: number;
    place_id: string;
    
    // These are from the base response, but also available in details
    opening_hours?: string;
    website?: string;
    phone?: string;
    
    details?: string[];
    datasource: {
        raw: {
            // Common OSM tags
            phone?: string;
            website?: string;
            image?: string;
            sport?: string; // e.g., "tennis;basketball"
            leisure?: string;
            amenity?: string;
            "opening_hours"?: string;
            // Less common but useful
            "charge"?: string; // For pricing info
            "payment:cash"?: "yes" | "no";
            "payment:credit_cards"?: "yes" | "no";
        }
    };
    // From place-details with &features=details...
    contact?: {
        phone?: string;
        website?: string;
        email?: string;
    };
    facilities?: {
        // Based on https://wiki.openstreetmap.org/wiki/Key:amenity
        toilets?: "yes" | "no";
        "toilets:wheelchair"?: "yes" | "no" | "limited";
        wheelchair?: "yes" | "no" | "limited";
        internet_access?: "wlan" | "yes" | "no" | "wired";
        "internet_access:fee"?: "yes" | "no" | "customers";
        shower?: "yes" | "no";
        parking?: "yes" | "no" | "surface" | "underground";
        "fee:parking"?: string;
        cctv?: "yes" | "no";
        "surveillance:type"?: "cctv" | "guard";
        lockers?: "yes" | "no";
        food?: "yes" | "no";
        vending_machine?: "yes" | "no";
        // and many more from OSM...
        [key: string]: string | undefined;
    };
    wiki_and_media?: {
        wikipedia?: string;
        image?: string;
        description?: string;
    };
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}


export interface FacilitatorDashboardStats {
    totalVenues: number;
    approvedVenues: number;
    pendingVenues: number;
    totalBookings: number;
    monthlyEarnings: number;
    peakHours: string;
}

export interface ChatMessage {
  id: string;
  user: Pick<User, 'fullName' | 'avatar'>;
  text: string;
  timestamp: string;
}