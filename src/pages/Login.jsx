import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = ({ initialState = 'Login' }) => {
  const [currentState, setCurrentState] = useState(initialState);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      if (currentState === 'Sign Up') {
        // Simulate API call for registration
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock successful registration
        const userData = { 
          name, 
          email,
          id: Date.now() // Mock user ID
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        login(userData, mockToken);
        
        toast.success('Account created successfully! Welcome to Korai Health!', {
          position: "top-center",
          autoClose: 3000,
        });
        
        // Navigate to dashboard or intended page
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
        
      } else {
        // Simulate API call for login
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock successful login (you can add validation here)
        const userData = { 
          name: 'User', 
          email,
          id: Date.now()
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        login(userData, mockToken);
        
        toast.success('Welcome back! You have been successfully logged in.', {
          position: "top-center",
          autoClose: 3000,
        });
        
        // Navigate to dashboard or intended page
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.log('Authentication error:', error);
      toast.error('Authentication failed. Please try again.', {
        position: "top-center",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simple animated background component
  const HealthCanvas = () => {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
        {/* Animated health icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Main health icon */}
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-8 -left-8 w-6 h-6 bg-white/30 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-6 -right-6 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/2 -left-12 w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/4 -right-10 w-5 h-5 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-8 h-8">
            <svg fill="currentColor" viewBox="0 0 20 20" className="text-white">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute bottom-20 right-16 w-6 h-6">
            <svg fill="currentColor" viewBox="0 0 20 20" className="text-white">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="flex bg-gray-100 rounded-3xl drop-shadow-[8px_8px_0px_#3B82F6] overflow-hidden max-w-4xl w-full m-4 z-50">
          {/* Left side with canvas */}
          <div className="hidden md:flex md:w-1/2 bg-gray-200 items-center justify-center canvas-container">
            <HealthCanvas />
          </div>
          
          {/* Right side with form */}
          <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center">
            {/* Show message if redirected from file upload */}
            {location.state?.message && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">{location.state.message}</p>
              </div>
            )}

            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">Korai Health</span>
            </div>

            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {currentState === 'Login' ? 'Welcome back!' : 'Join Korai Health'}
            </h1>
            <p className="text-gray-600 mb-6">
              {currentState === 'Login' ? 'Sign in to access your health insights' : 'Create your account to get started with AI-powered health analysis'}
            </p>

            <form onSubmit={onSubmitHandler}>
              {currentState === 'Sign Up' && (
                <>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </>
              )}

              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your email address"
                required
              />

              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your password"
                required
              />

              {currentState === 'Login' && (
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me for 30 days
                    </label>
                  </div>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              {currentState === 'Sign Up' && (
                <div className="mb-6">
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{' '}
                      <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium">
                        Terms of Service
                      </span>{' '}
                      and{' '}
                      <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium">
                        Privacy Policy
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-bold transition-colors duration-200 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading 
                    ? 'bg-blue-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {currentState === 'Login' ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  currentState === 'Login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-bold flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 border border-gray-300">
              <img
                src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              {currentState === 'Login' ? 'Sign in with Google' : 'Sign up with Google'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              {currentState === 'Login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
                className="text-blue-600 font-bold hover:text-blue-800 hover:underline"
              >
                {currentState === 'Login' ? 'Sign up for free' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;