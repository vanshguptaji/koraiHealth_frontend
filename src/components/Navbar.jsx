import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('You have been successfully logged out. See you next time!', {
        position: "top-center",
        autoClose: 3000,
      });
      navigate('/');
    } catch (error) {
      console.log('Logout error:', error);
      toast.error('Logout failed. Please try again.', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">Korai Health</span>
              <span className="text-xs text-gray-500 -mt-1">Lab Report Analyzer</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
                Home
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
                  Dashboard
                </Link>
              )}
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
                About
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Welcome, {user?.name}!</span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
                    Log In
                  </Link>
                  <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 shadow-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium">
                Home
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium">
                  Dashboard
                </Link>
              )}
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium">
                Features
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium">
                About
              </a>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <span className="px-3 py-2 text-sm text-gray-600">Welcome, {user?.name}!</span>
                    <button 
                      onClick={handleLogout}
                      className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium text-left">
                      Log In
                    </Link>
                    <Link to="/signup" className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;