
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthScreenType } from '../types';
import { EyeIcon, EyeOffIcon } from '../components/icons';

const AuthScreen: React.FC = () => {
  const [authType, setAuthType] = useState<AuthScreenType>(AuthScreenType.Login);
  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/profile');
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup();
    setAuthType(AuthScreenType.Verify);
  };
  
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verifying OTP:", otp.join(""));
    navigate('/');
  }

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const commonInputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow";

  const renderForm = () => {
    switch(authType) {
      case AuthScreenType.Login:
        return (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-text-dark">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className={commonInputClass}/>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-text-dark">Password</label>
              <div className="mt-1 relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className={commonInputClass}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm leading-5">
                  {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-semibold text-primary hover:underline">Forgot password?</a>
              </div>
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-opacity-50 transition-opacity">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        );
      case AuthScreenType.SignUp:
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
             <div>
                <label className="block text-sm font-bold text-text-dark">Full Name</label>
                <input type="text" required className={`${commonInputClass} mt-1`}/>
            </div>
            <div>
                <label className="block text-sm font-bold text-text-dark">Email address</label>
                <input type="email" required className={`${commonInputClass} mt-1`}/>
            </div>
            <div>
                <label className="block text-sm font-bold text-text-dark">Password</label>
                 <div className="mt-1 relative">
                    <input type={showPassword ? "text" : "password"} required className={commonInputClass}/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">8-20 characters with upper, lower, number & symbol.</p>
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-opacity-50 transition-opacity">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
        );
      case AuthScreenType.Verify:
        return (
            <form onSubmit={handleVerify} className="space-y-8">
                <div className="flex justify-center space-x-2 sm:space-x-3">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-3xl font-bold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                            value={data}
                            onChange={e => handleOtpChange(e.target, index)}
                            onFocus={e => e.target.select()}
                            ref={el => { otpInputs.current[index] = el; }}
                        />
                    ))}
                </div>
                 <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-opacity">
                        Verify & Continue
                    </button>
                </div>
                 <div className="text-center text-sm">
                    <p className="text-gray-600">Didn't receive code? <button type="button" className="font-semibold text-primary hover:underline">Resend OTP</button></p>
                </div>
            </form>
        );
    }
  };
  
  const getTitle = () => {
      switch(authType) {
          case AuthScreenType.Login: return "Welcome Back!";
          case AuthScreenType.SignUp: return "Create Your Account";
          case AuthScreenType.Verify: return "Verify Your Email";
      }
  }

  const getSubtitle = () => {
      switch(authType) {
          case AuthScreenType.Login: return "Don't have an account?";
          case AuthScreenType.SignUp: return "Already have an account?";
          case AuthScreenType.Verify: return `We've sent a 6-digit code to your email.`;
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
       <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Left side - Image */}
         <div className="hidden lg:block relative">
            <img src="https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=1887&auto=format&fit=crop" className="w-full h-full object-cover" alt="People playing sports"/>
            <div className="absolute inset-0 bg-primary opacity-50"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                <h1 className="text-5xl font-extrabold leading-tight">Your Next Game Awaits.</h1>
                <p className="mt-4 text-lg max-w-md">Book venues, find players, and get in the game faster than ever.</p>
            </div>
         </div>

        {/* Right side - Form */}
        <div className="flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-4xl font-extrabold text-text-dark">
                {getTitle()}
            </h2>
            <p className="mt-3 text-md text-gray-600">
              {getSubtitle()}
              {authType !== AuthScreenType.Verify && (
                <button onClick={() => setAuthType(authType === AuthScreenType.Login ? AuthScreenType.SignUp : AuthScreenType.Login)} className="font-semibold text-primary hover:underline ml-1">
                    {authType === AuthScreenType.Login ? 'Sign Up' : 'Sign In'}
                </button>
              )}
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

export default AuthScreen;
