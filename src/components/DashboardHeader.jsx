import React from 'react';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Korai Health</span>
              <span className="text-sm text-gray-500">Lab Report Analyzer</span>
            </div>
          </div>

          {/* Upload New Report Button */}
          <Link to="/">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Upload New Report
            </button>
          </Link>
        </div>
      </div>

      {/* Page Title Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Your Health Analysis</h1>
          <p className="text-gray-600">Here's what we found in your lab report</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
