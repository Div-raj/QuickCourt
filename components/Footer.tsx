import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-extrabold text-accent">QUICKCOURT</h3>
            <p className="mt-4 text-gray-300 text-sm leading-relaxed">
              The easiest way to book premium sports facilities and connect with fellow players. Your next game is just a click away.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-200 tracking-wider uppercase">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/venues" className="text-gray-300 hover:text-accent transition-colors">Book a Venue</Link></li>
              <li><Link to="/facilitator/auth" className="text-gray-300 hover:text-accent transition-colors">For Business</Link></li>
              <li><Link to="/admin/auth" className="text-gray-300 hover:text-accent transition-colors">Admin Login</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-accent transition-colors">Sports</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-accent transition-colors">Offers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-200 tracking-wider uppercase">Support</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-accent transition-colors">Help Center</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold text-gray-200 tracking-wider uppercase">Newsletter</h4>
             <p className="mt-4 text-gray-300 text-sm">Get the latest updates and special offers.</p>
             <div className="mt-4 flex">
                <input type="email" placeholder="Your email" className="w-full bg-secondary/40 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent"/>
                <button className="bg-accent text-white font-semibold px-4 py-2 rounded-r-md hover:bg-accent-dark transition-colors">Go</button>
             </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} QuickCourt. All rights reserved. A passion project for sports lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;