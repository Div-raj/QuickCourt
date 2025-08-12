
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthScreenType } from '../../types';
import { EyeIcon, EyeOffIcon } from '../../components/icons';

const FacilitatorAuthScreen: React.FC = () => {
  const [authType, setAuthType] = useState<AuthScreenType>(AuthScreenType.Login);
  const { facilitatorLogin, signup, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('chris.j@venuepro.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await facilitatorLogin(email, password);
    navigate('/facilitator/dashboard');
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a signup flow and then verification
    await signup();
    alert("Registration submitted! You will receive an email upon verification. For now, please log in with the mock account.");
    setAuthType(AuthScreenType.Login);
  };

  const commonInputClass = "w-full px-4 py-3 border border-border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-shadow bg-surface text-secondary";

  const renderForm = () => {
    switch(authType) {
      case AuthScreenType.Login:
        return (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-secondary">Business Email</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className={commonInputClass}/>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-secondary">Password</label>
              <div className="mt-1 relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className={commonInputClass}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm leading-5">
                  {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-semibold text-accent hover:underline">Forgot password?</a>
              </div>
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-opacity-50 transition-colors">
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              </button>
            </div>
          </form>
        );
      case AuthScreenType.SignUp:
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
             <div>
                <label className="block text-sm font-bold text-secondary">Full Name</label>
                <input type="text" required className={`${commonInputClass} mt-1`}/>
            </div>
             <div>
                <label className="block text-sm font-bold text-secondary">Business / Venue Name</label>
                <input type="text" required className={`${commonInputClass} mt-1`}/>
            </div>
            <div>
                <label className="block text-sm font-bold text-secondary">Business Email</label>
                <input type="email" required className={`${commonInputClass} mt-1`}/>
            </div>
            <div>
                <label className="block text-sm font-bold text-secondary">Phone Number</label>
                <input type="tel" required className={`${commonInputClass} mt-1`}/>
            </div>
             <div>
                <label className="block text-sm font-bold text-secondary">Business Address</label>
                <input type="text" placeholder="We'll help you pinpoint on a map later" required className={`${commonInputClass} mt-1`}/>
            </div>
            <div>
                <label className="block text-sm font-bold text-secondary">Password</label>
                 <div className="mt-1 relative">
                    <input type={showPassword ? "text" : "password"} required className={commonInputClass}/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                    </button>
                </div>
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-opacity-50 transition-colors">
                {loading ? 'Submitting...' : 'Register Your Business'}
              </button>
            </div>
          </form>
        );
      default: return null;
    }
  };
  
  const getTitle = () => {
      switch(authType) {
          case AuthScreenType.Login: return "Facilitator Login";
          case AuthScreenType.SignUp: return "List Your Venue";
      }
  }

  const getSubtitle = () => {
      switch(authType) {
          case AuthScreenType.Login: return "Don't have a business account?";
          case AuthScreenType.SignUp: return "Already have an account?";
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
       <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Left side - Image */}
         <div className="hidden lg:block relative">
            <img src="https://images.unsplash.com/photo-1596324207597-4da359b587a7?q=80&w=1887&auto=format&fit=crop" className="w-full h-full object-cover" alt="Sports venue"/>
            <div className="absolute inset-0 bg-primary opacity-60"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                <h1 className="text-5xl font-extrabold leading-tight">Join the Premier Sports Network.</h1>
                <p className="mt-4 text-lg max-w-md">Reach new customers, manage bookings, and grow your business with QuickCourt.</p>
            </div>
         </div>

        {/* Right side - Form */}
        <div className="flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-4xl font-extrabold text-secondary">
                {getTitle()}
            </h2>
            <p className="mt-3 text-md text-gray-600">
              {getSubtitle()}
              <button onClick={() => setAuthType(authType === AuthScreenType.Login ? AuthScreenType.SignUp : AuthScreenType.Login)} className="font-semibold text-accent hover:underline ml-1">
                  {authType === AuthScreenType.Login ? 'Sign Up Here' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-10 mx-auto w-full max-w-md">
              {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitatorAuthScreen;
