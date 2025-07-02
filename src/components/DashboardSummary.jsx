import React, { useState, useEffect } from 'react';
import labReportService from '../services/labReportService';

const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalReports: 0,
    totalParameters: 0,
    recentReports: [],
    recentParameters: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummaryData();
  }, []);

  const loadSummaryData = async () => {
    try {
      setLoading(true);
      const response = await labReportService.getHealthDashboard();
      
      if (response.success && response.data) {
        setSummaryData(response.data);
      }
    } catch (error) {
      console.error('Error loading summary data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Reports */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Reports</p>
              <p className="text-2xl font-semibold text-blue-900">{summaryData.totalReports}</p>
            </div>
          </div>
        </div>

        {/* Total Parameters */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Total Parameters</p>
              <p className="text-2xl font-semibold text-green-900">{summaryData.totalParameters}</p>
            </div>
          </div>
        </div>

        {/* Recent Parameters */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Recent Parameters</p>
              <p className="text-2xl font-semibold text-purple-900">{summaryData.recentParameters?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">Recent Reports</p>
              <p className="text-2xl font-semibold text-orange-900">{summaryData.recentReports?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {(summaryData.recentParameters?.length > 0) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-600">Parameters analyzed from</span>
              <span className="font-semibold text-gray-900 ml-1">{summaryData.totalReports} reports</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-600">Latest data from</span>
              <span className="font-semibold text-gray-900 ml-1">
                {summaryData.recentParameters?.length > 0 
                  ? new Date(summaryData.recentParameters[0].createdAt).toLocaleDateString()
                  : 'No recent data'
                }
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-600">Health parameters tracked</span>
              <span className="font-semibold text-gray-900 ml-1">{summaryData.totalParameters} total</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSummary;
