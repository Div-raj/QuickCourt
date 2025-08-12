import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthScreenType } from '../types';
import { EyeIcon, EyeOffIcon } from '../components/icons';

const AuthScreen: React.FC = () => {
  const [authType, setAuthType] = useState<AuthScreenType>(AuthScreenType.Login);
  const { login, signup, loading, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword();
    setAuthType(AuthScreenType.ResetPassword);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    await resetPassword();
    setResetSuccessMessage("Password reset successfully. Please log in with your new password.");
    setNewPassword('');
    setConfirmPassword('');
    setAuthType(AuthScreenType.Login);
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const commonInputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow text-secondary";

  const renderForm = () => {
    switch(authType) {
      case AuthScreenType.Login:
        return (
          <>
            {resetSuccessMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-200 rounded-lg text-sm">
                {resetSuccessMessage}
                </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                <label htmlFor="email" className="block text-sm font-bold text-secondary">Email address</label>
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
                    <button type="button" onClick={() => setAuthType(AuthScreenType.ForgotPassword)} className="font-semibold text-accent hover:underline">Forgot password?</button>
                </div>
                </div>
                <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg-accent text-lg font-bold text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-opacity-50 transition-all">
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                </div>
            </form>
          </>
        );
      case AuthScreenType.SignUp:
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
             <div>
                <label className="block text-sm font-bold text-secondary">Full Name</label>
                <input type="text" required className={`${commonInputClass} mt-1`}/>
            </div>
            <div>
                <label className="block text-sm font-bold text-secondary">Email address</label>
                <input type="email" required className={`${commonInputClass} mt-1`}/>
            </div>
            <div>
                <label className="block text-sm font-bold text-secondary">Password</label>
                 <div className="mt-1 relative">
                    <input type={showPassword ? "text" : "password"} required className={commonInputClass}/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">8-20 characters with upper, lower, number & symbol.</p>
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg-accent text-lg font-bold text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-opacity-50 transition-all">
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
                            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-3xl font-bold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow text-secondary"
                            value={data}
                            onChange={e => handleOtpChange(e.target, index)}
                            onFocus={e => e.target.select()}
                            ref={el => { otpInputs.current[index] = el; }}
                        />
                    ))}
                </div>
                 <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg-accent text-lg font-bold text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all">
                        Verify & Continue
                    </button>
                </div>
                 <div className="text-center text-sm">
                    <p className="text-gray-600">Didn't receive code? <button type="button" className="font-semibold text-accent hover:underline">Resend OTP</button></p>
                </div>
            </form>
        );
      case AuthScreenType.ForgotPassword:
        return (
            <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-secondary">Email address</label>
                    <div className="mt-1">
                    <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className={commonInputClass}/>
                    <p className="text-xs text-gray-500 mt-2">We'll send a password reset link to this email if it's associated with an account.</p>
                    </div>
                </div>
                <div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg-accent text-lg font-bold text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-opacity-50 transition-all">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>
            </form>
        );
      case AuthScreenType.ResetPassword:
        return (
            <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-secondary">New Password</label>
                    <div className="mt-1 relative">
                        <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} required className={commonInputClass}/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-secondary">Confirm New Password</label>
                    <div className="mt-1 relative">
                        <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className={commonInputClass}/>
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>
                </div>
                <div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg-accent text-lg font-bold text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-opacity-50 transition-all">
                    {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
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
          case AuthScreenType.ForgotPassword: return "Forgot Your Password?";
          case AuthScreenType.ResetPassword: return "Create a New Password";
      }
  }

  const getSubtitle = () => {
      switch(authType) {
          case AuthScreenType.Login: return "Don't have an account?";
          case AuthScreenType.SignUp: return "Already have an account?";
          case AuthScreenType.Verify: return `We've sent a 6-digit code to your email.`;
          case AuthScreenType.ForgotPassword: return `Enter your email and we'll send you a link to get back into your account.`;
          case AuthScreenType.ResetPassword: return `Your new password must be different from previous used passwords.`;
      }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
       <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full bg-surface shadow-xl-soft rounded-2xl overflow-hidden">
        {/* Left side - Image */}
         <div className="hidden lg:block relative">
            <img src="https://images.unsplash.com/photo-1575361204480-aadea2503aa4?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="People playing sports"/>
            <div className="absolute inset-0 bg-accent opacity-70"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                <h1 className="text-5xl font-extrabold leading-tight">Your Next Game Awaits.</h1>
                <p className="mt-4 text-lg max-w-md">Book venues, find players, and get in the game faster than ever.</p>
            </div>
         </div>

        {/* Right side - Form */}
        <div className="flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-4xl font-extrabold text-secondary">
                {getTitle()}
            </h2>
            <p className="mt-3 text-md text-secondary/70">
              {getSubtitle()}
              {authType === AuthScreenType.Login && (
                <button onClick={() => { setResetSuccessMessage(''); setAuthType(AuthScreenType.SignUp); }} className="font-semibold text-accent hover:underline ml-1">
                    Sign Up
                </button>
              )}
              {authType === AuthScreenType.SignUp && (
                <button onClick={() => setAuthType(AuthScreenType.Login)} className="font-semibold text-accent hover:underline ml-1">
                    Sign In
                </button>
              )}
              {(authType === AuthScreenType.ForgotPassword || authType === AuthScreenType.ResetPassword) && (
                <button onClick={() => setAuthType(AuthScreenType.Login)} className="font-semibold text-accent hover:underline ml-1">
                    Back to Sign In
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