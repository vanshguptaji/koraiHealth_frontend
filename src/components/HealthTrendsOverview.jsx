import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import labReportService from '../services/labReportService';
import { toast } from 'react-toastify';
import TrendChart from './TrendChart';

const HealthTrendsOverview = () => {
  const { user } = useAuth();
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    // Clear previous data when user changes
    setTrendData([]);
    setError(null);
    loadTrendsData();
  }, [selectedPeriod, user?._id]); // Add user._id as dependency

  const loadTrendsData = async () => {
    try {
      setLoading(true);
      const response = await labReportService.getHealthTrends(null, selectedPeriod);
      
      if (response.success && response.data) {
        console.log('HealthTrendsOverview received data:', response.data);
        
        // Handle the new backend structure with 'parameters' and 'trends' fields
        if (response.data.trends && Object.keys(response.data.trends).length > 0) {
          // Transform backend trends data for display
          const transformedTrends = Object.entries(response.data.trends).map(([paramName, dataPoints]) => {
            if (!dataPoints || dataPoints.length === 0) return null;
            
            // Sort by date to get latest value and calculate trend
            const sortedData = dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
            const currentValue = sortedData[sortedData.length - 1]?.value || 0;
            const previousValue = sortedData.length > 1 ? sortedData[0]?.value : currentValue;
            
            // Calculate trend percentage
            const trendPercentage = previousValue !== 0 && sortedData.length > 1
              ? ((currentValue - previousValue) / previousValue * 100).toFixed(1)
              : 0;
            
            const isIncreasing = currentValue > previousValue && sortedData.length > 1;
            const isDecreasing = currentValue < previousValue && sortedData.length > 1;
            
            // Find parameter details from the parameters array
            const parameterDetails = response.data.parameters?.find(p => 
              (p.name && p.name.toLowerCase()) === paramName.toLowerCase() ||
              (p.parameterName && p.parameterName.toLowerCase()) === paramName.toLowerCase()
            );
            
            return {
              parameter: paramName,
              currentValue: currentValue.toFixed(2),
              trend: isIncreasing ? 'increasing' : isDecreasing ? 'decreasing' : 'stable',
              trendPercentage: `${trendPercentage > 0 ? '+' : ''}${trendPercentage}%`,
              color: isIncreasing ? 'green' : isDecreasing ? 'red' : 'gray',
              chartColor: isIncreasing ? '#10B981' : isDecreasing ? '#EF4444' : '#6B7280',
              trendIcon: isIncreasing ? '↗' : isDecreasing ? '↘' : '→',
              unit: sortedData[sortedData.length - 1]?.unit || '',
              status: sortedData[sortedData.length - 1]?.status || 'normal',
              category: parameterDetails?.category || 'general',
              referenceRange: parameterDetails?.referenceRange?.text || 'N/A',
              dataPoints: sortedData.map(point => ({
                date: new Date(point.date).toLocaleDateString(),
                value: point.value,
                status: point.status
              }))
            };
          }).filter(Boolean);
          
          setTrendData(transformedTrends);
        } else if (response.data.parameters && Array.isArray(response.data.parameters)) {
          // Handle parameters array when no trends structure is available
          const parameterGroups = response.data.parameters.reduce((groups, param) => {
            const paramName = param.name || param.parameterName || 'Unknown';
            if (!groups[paramName]) {
              groups[paramName] = [];
            }
            groups[paramName].push({
              date: param.createdAt || param.uploadDate,
              value: typeof param.value === 'number' ? param.value : parseFloat(param.value) || 0,
              unit: param.unit || '',
              status: param.status || 'normal',
              category: param.category || 'general',
              referenceRange: param.referenceRange?.text || param.referenceRange || 'N/A'
            });
            return groups;
          }, {});
          
          const transformedTrends = Object.entries(parameterGroups).map(([paramName, dataPoints]) => {
            if (dataPoints.length === 0) return null;
            
            const sortedData = dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
            const currentValue = sortedData[sortedData.length - 1]?.value || 0;
            const previousValue = sortedData.length > 1 ? sortedData[0]?.value : currentValue;
            
            const trendPercentage = previousValue !== 0 && sortedData.length > 1
              ? ((currentValue - previousValue) / previousValue * 100).toFixed(1)
              : 0;
            
            const isIncreasing = currentValue > previousValue && sortedData.length > 1;
            const isDecreasing = currentValue < previousValue && sortedData.length > 1;
            
            return {
              parameter: paramName,
              currentValue: currentValue.toFixed(2),
              trend: isIncreasing ? 'increasing' : isDecreasing ? 'decreasing' : 'stable',
              trendPercentage: `${trendPercentage > 0 ? '+' : ''}${trendPercentage}%`,
              color: isIncreasing ? 'green' : isDecreasing ? 'red' : 'gray',
              chartColor: isIncreasing ? '#10B981' : isDecreasing ? '#EF4444' : '#6B7280',
              trendIcon: isIncreasing ? '↗' : isDecreasing ? '↘' : '→',
              unit: sortedData[sortedData.length - 1]?.unit || '',
              status: sortedData[sortedData.length - 1]?.status || 'normal',
              category: sortedData[sortedData.length - 1]?.category || 'general',
              referenceRange: sortedData[sortedData.length - 1]?.referenceRange || 'N/A',
              dataPoints: sortedData.map(point => ({
                date: new Date(point.date).toLocaleDateString(),
                value: point.value,
                status: point.status
              }))
            };
          }).filter(Boolean);
          
          setTrendData(transformedTrends);
        } else {
          // Fallback to sample data if no real data
          setTrendData([]);
        }
      } else {
        setTrendData([]);
      }
    } catch (error) {
      console.error('Error loading trends data:', error);
      setError('Failed to load health trends');
      toast.error('Failed to load health trends');
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend) => {
    return trend === 'increasing' ? 'text-green-600' : trend === 'decreasing' ? 'text-red-600' : 'text-gray-600';
  };

  const getTrendBgColor = (trend) => {
    return trend === 'increasing' ? 'bg-green-100' : trend === 'decreasing' ? 'bg-red-100' : 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-500 py-8">
          <p className="mb-4">{error}</p>
          <button 
            onClick={loadTrendsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (trendData.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-blue-600">Health Trends Overview</h2>
        <div className="text-center text-gray-500 py-8">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Trend Data Available</h3>
          <p className="text-gray-600 mb-4">Upload multiple lab reports to see health trends over time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-blue-600 mb-4 sm:mb-0">Health Trends Overview</h2>
        
        <div className="flex space-x-2">
          {[7, 30, 90, 365].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedPeriod(days)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedPeriod === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {days === 365 ? '1Y' : `${days}D`}
            </button>
          ))}
        </div>
      </div>
      
      {/* Trend Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {trendData.slice(0, 4).map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 capitalize">{item.parameter}</h3>
              <span className="text-lg">{item.trendIcon}</span>
            </div>
            
            <div className="mb-2">
              <div className="text-2xl font-bold text-blue-600">
                {item.currentValue}
                <span className="text-sm font-normal text-gray-500 ml-1">{item.unit}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${getTrendBgColor(item.trend)} ${getTrendColor(item.trend)}`}>
                {item.trend}
              </span>
              <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                {item.trendPercentage}
              </span>
            </div>

            {/* Status indicator */}
            {item.status && (
              <div className="mt-2 text-xs">
                <span className={`px-2 py-1 rounded-full ${
                  item.status === 'normal' ? 'bg-green-100 text-green-800' :
                  item.status === 'high' ? 'bg-red-100 text-red-800' :
                  item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
            )}

            {/* Reference range */}
            {item.referenceRange && item.referenceRange !== 'N/A' && (
              <div className="mt-2 text-xs text-gray-500">
                Range: {item.referenceRange}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Chart */}
      <TrendChart trendData={trendData} selectedPeriod={selectedPeriod} />
    </div>
  );
};

export default HealthTrendsOverview;
