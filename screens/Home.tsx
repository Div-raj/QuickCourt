
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SPORTS, MOCK_VENUES, REVIEWS } from '../constants';
import { ChevronRightIcon, SearchIcon, CalendarIcon, UserIcon, LocationPinIcon, QuoteIcon } from '../components/icons';
import VenueCard from '../components/VenueCard';
import StarRating from '../components/StarRating';

const SportIconCard: React.FC<{ sport: typeof SPORTS[0] }> = ({ sport }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate('/venues')}
      className="flex flex-col items-center justify-center text-center group cursor-pointer"
    >
      <div className="w-32 h-32 md:w-40 md:h-40 bg-surface rounded-2xl shadow-lg-soft flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl-soft">
        <img src={sport.image} alt={sport.name} className="w-24 h-24 md:w-32 md:h-32 object-contain transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-secondary transition-colors duration-300 group-hover:text-accent">{sport.name}</h3>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-primary text-secondary">

      {/* Hero Section */}
      <section className="relative bg-secondary" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1521295121783-8a321d551ac2?q=80&w=2070&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-secondary/30"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center min-h-[60vh] md:min-h-[70vh] py-20">
              <h1 className="text-5xl md:text-7xl font-extrabold text-surface" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.5)'}}>Your Next Game Awaits</h1>
              <p className="mt-4 text-xl text-surface/90 max-w-3xl mx-auto" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.5)'}}>The ultimate platform to discover, book, and play at the best sports venues near you.</p>
              
              <div className="mt-10 w-full max-w-2xl bg-surface/90 backdrop-blur-md p-4 rounded-full shadow-2xl-soft border border-border/20">
                  <form onSubmit={(e) => { e.preventDefault(); navigate('/venues'); }} className="flex items-center gap-2">
                    <LocationPinIcon className="w-6 h-6 text-secondary/60 ml-2 shrink-0"/>
                    <input type="text" placeholder="Enter your city or area..." className="w-full bg-transparent p-2 text-lg text-secondary placeholder-secondary/50 focus:outline-none"/>
                    <button type="submit" className="bg-accent text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-accent-dark transition-all transform hover:scale-105 duration-300 shadow-lg-accent">
                      Search
                    </button>
                  </form>
              </div>
          </div>
      </section>

      {/* Find by Sport Section */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-secondary">Find By Sport</h2>
            <button onClick={() => navigate('/venues')} className="hidden sm:flex items-center font-semibold text-accent hover:underline">
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

      {/* Featured Venues Section */}
      <section className="bg-surface py-16 md:py-20 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-secondary">Top Rated Venues</h2>
              <p className="mt-2 text-lg text-secondary/80 max-w-2xl mx-auto">Handpicked venues that players love for their quality and service.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {MOCK_VENUES.map(venue => (
                <VenueCard key={venue.id} venue={venue}/>
              ))}
            </div>
             <div className="text-center mt-12">
                <button onClick={() => navigate('/venues')} className="bg-accent text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-accent-dark transition-all transform hover:scale-105 duration-300 shadow-lg-accent">
                  View All Venues
                </button>
            </div>
          </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-extrabold text-center text-secondary mb-4">Get in the Game in 3 Easy Steps</h2>
              <p className="text-center text-lg text-secondary/80 max-w-2xl mx-auto mb-16">Booking your next match has never been simpler.</p>
              <div className="relative">
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="bg-surface border-2 border-border text-accent rounded-full w-24 h-24 flex items-center justify-center mb-6 ring-8 ring-primary relative z-10">
                            <SearchIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary mb-2">1. Discover Venues</h3>
                        <p className="text-secondary/70">Use our powerful search to find the perfect court or field near you.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-surface border-2 border-border text-accent rounded-full w-24 h-24 flex items-center justify-center mb-6 ring-8 ring-primary relative z-10">
                            <CalendarIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary mb-2">2. Book A Slot</h3>
                        <p className="text-secondary/70">Select your date and time, and confirm your booking in just a few clicks.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-surface border-2 border-border text-accent rounded-full w-24 h-24 flex items-center justify-center mb-6 ring-8 ring-primary relative z-10">
                            <UserIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary mb-2">3. Connect & Play</h3>
                        <p className="text-secondary/70">Use Player Connect to find teammates or opponents and get ready for the game!</p>
                    </div>
                </div>
              </div>
          </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-center text-secondary mb-12">What Players Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {REVIEWS.map((review) => (
                    <div key={review.id} className="bg-primary/50 p-8 rounded-2xl border border-border/50 shadow-lg-soft">
                        <QuoteIcon className="w-10 h-10 text-accent/30 mb-4"/>
                        <p className="text-secondary/80 italic text-lg mb-6">"{review.comment}"</p>
                        <div className="flex items-center">
                            <img src={review.user.avatar} alt={review.user.fullName} className="w-14 h-14 rounded-full mr-4 border-2 border-accent" />
                            <div>
                                <p className="font-bold text-secondary">{review.user.fullName}</p>
                                <StarRating rating={review.rating} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA For Business */}
       <section className="relative py-20 bg-secondary" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop)', backgroundPosition: 'center', backgroundSize: 'cover'}}>
        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-4xl font-extrabold">List Your Venue on QuickCourt</h2>
            <p className="mt-4 text-xl max-w-3xl mx-auto text-gray-300">Join our network of premium sports facilities. Reach more players, streamline your bookings, and grow your business with us.</p>
            <button onClick={() => navigate('/facilitator/auth')} className="mt-8 bg-accent text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-accent-dark transition-all transform hover:scale-105 duration-300 shadow-lg-accent">
                Become a Partner
            </button>
        </div>
      </section>

    </div>
  );
};

export default Home;