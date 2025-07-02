import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import labReportService from '../services/labReportService';
import { toast } from 'react-toastify';

const HealthParametersTable = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('All');
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewData, setIsNewData] = useState(false);

  useEffect(() => {
    loadHealthData();
    
    // Check if this is a fresh load from upload
    if (location.state?.uploadSuccess) {
      setIsNewData(true);
      
      // If we expect parameters but don't see them yet, retry loading after a short delay
      const { uploadResult } = location.state;
      if (uploadResult?.parametersFound > 0) {
        const retryTimeout = setTimeout(() => {
          loadHealthData();
        }, 1000); // Retry after 1 second
        
        return () => clearTimeout(retryTimeout);
      }
      
      // Remove the highlight after 3 seconds
      setTimeout(() => setIsNewData(false), 3000);
    }
  }, [location.state]);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      const response = await labReportService.getHealthDashboard();
      
      if (response.success && response.data) {
        // Check if we have latestParameters (from real backend) or empty fallback data
        if (response.data.latestParameters && response.data.latestParameters.length > 0) {
          // Transform backend data to match frontend format
          const transformedData = response.data.latestParameters.map(param => ({
            parameter: param.name,
            value: param.value.toFixed(2),
            unit: param.unit,
            referenceRange: param.referenceRange?.text || 
                           (param.referenceRange?.min && param.referenceRange?.max 
                             ? `${param.referenceRange.min}-${param.referenceRange.max}` 
                             : 'N/A'),
            status: formatStatus(param.status),
            category: formatCategory(param.category),
            trend: 'stable', // Could be enhanced with historical data
            date: new Date(param.createdAt).toLocaleDateString(),
            reportId: param.reportId
          }));
          
          setHealthData(transformedData);
        } else {
          // No parameters available (either from fallback or empty real response)
          setHealthData([]);
        }
      } else {
        setHealthData([]);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
      setError('Failed to load health parameters');
      toast.error('Failed to load health parameters');
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      'normal': 'Normal',
      'high': 'High',
      'low': 'Low', 
      'critical_high': 'Critical High',
      'critical_low': 'Critical Low',
      'abnormal': 'Abnormal'
    };
    return statusMap[status] || status;
  };

  const formatCategory = (category) => {
    const categoryMap = {
      'blood': 'Blood',
      'urine': 'Urine',
      'lipid': 'Lipids',
      'liver': 'Liver',
      'kidney': 'Kidney', 
      'diabetes': 'Diabetes',
      'thyroid': 'Thyroid',
      'cardiac': 'Cardiac',
      'other': 'Other'
    };
    return categoryMap[category] || category;
  };

  // Get unique filter options from the data
  const getFilterOptions = () => {
    if (healthData.length === 0) return ['All'];
    const categories = [...new Set(healthData.map(item => item.category))];
    return ['All', ...categories];
  };

  const filteredData = activeFilter === 'All' 
    ? healthData 
    : healthData.filter(item => item.category === activeFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'High':
      case 'Critical High':
        return 'text-red-600 bg-red-100';
      case 'Normal': 
        return 'text-green-600 bg-green-100';
      case 'Low':
      case 'Critical Low':
        return 'text-blue-600 bg-blue-100';
      case 'Abnormal':
        return 'text-orange-600 bg-orange-100';
      default: 
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7M17 17H7" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10M7 7h10" />
          </svg>
        );
      case 'stable':
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="h-6 bg-gray-300 rounded w-48"></div>
            {location.state?.uploadSuccess && (
              <div className="ml-3 h-5 bg-blue-200 rounded-full w-20"></div>
            )}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
          {location.state?.uploadSuccess && (
            <div className="mt-4 text-center">
              <p className="text-sm text-blue-600 animate-pulse">
                Loading your newly uploaded lab report data...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <p className="mb-4">{error}</p>
          <button 
            onClick={loadHealthData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (healthData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Health Parameters Found</h3>
          <p className="text-gray-600 mb-4">Upload a lab report to see your health parameters here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg ${isNewData ? 'ring-2 ring-blue-400 ring-opacity-75' : ''} transition-all duration-1000`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <h2 className="text-xl font-bold text-gray-900">Health Parameters</h2>
            {isNewData && (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Fresh Data
              </span>
            )}
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {getFilterOptions().map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parameter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.parameter}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {item.value} <span className="text-gray-500 font-normal">{item.unit}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{item.referenceRange}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTrendIcon(item.trend)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredData.length} of {healthData.length} parameters</span>
          <button 
            onClick={loadHealthData}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthParametersTable;
