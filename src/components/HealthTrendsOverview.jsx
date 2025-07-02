import React, { useState, useEffect } from 'react';
import labReportService from '../services/labReportService';
import { toast } from 'react-toastify';

const HealthTrendsOverview = () => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    loadTrendsData();
  }, [selectedPeriod]);

  const loadTrendsData = async () => {
    try {
      setLoading(true);
      const response = await labReportService.getHealthTrends(null, selectedPeriod);
      
      if (response.success && response.data) {
        // Check if we have trendData (from real backend)
        if (response.data.trendData && Object.keys(response.data.trendData).length > 0) {
          // Transform backend trend data to match frontend format
          const transformedTrends = Object.entries(response.data.trendData).map(([paramName, dataPoints]) => {
            if (dataPoints.length === 0) return null;
            
            // Sort by date to get latest value and calculate trend
            const sortedData = dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
            const currentValue = sortedData[sortedData.length - 1]?.value || 0;
            const previousValue = sortedData.length > 1 ? sortedData[sortedData.length - 2]?.value : currentValue;
            
            // Calculate trend
            const trendPercentage = previousValue !== 0 
              ? ((currentValue - previousValue) / previousValue * 100).toFixed(1)
              : 0;
            
            const isIncreasing = currentValue > previousValue;
            const isDecreasing = currentValue < previousValue;
            
            return {
              parameter: paramName,
              currentValue: currentValue.toFixed(2),
              trend: isIncreasing ? 'increasing' : isDecreasing ? 'decreasing' : 'stable',
              trendPercentage: `${trendPercentage > 0 ? '+' : ''}${trendPercentage}%`,
              color: isIncreasing ? 'green' : isDecreasing ? 'red' : 'gray',
              chartColor: isIncreasing ? '#10B981' : isDecreasing ? '#EF4444' : '#6B7280',
              trendIcon: isIncreasing ? '↗' : isDecreasing ? '↘' : '→',
              unit: sortedData[sortedData.length - 1]?.unit || '',
              dataPoints: sortedData.map(point => ({
                date: point.date,
                value: point.value
              }))
            };
          }).filter(Boolean);
          
          setTrendData(transformedTrends);
        } else {
          // No trend data available (either from fallback or empty real response)
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
      <div className="grid md:grid-cols-3 gap-6">
        {trendData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{item.parameter}</h3>
              <span className="text-lg">{item.trendIcon}</span>
            </div>
            
            <div className="mb-2">
              <div className="text-2xl font-bold text-blue-600">{item.currentValue}</div>
            </div>
            
            <div className="flex items-center">
              <span className={`text-xs px-2 py-1 rounded-full ${getTrendBgColor(item.trend)} ${getTrendColor(item.trend)}`}>
                {item.trend}
              </span>
              <span className={`text-sm ml-2 ${getTrendColor(item.trend)}`}>
                {item.trendPercentage}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Total Cholesterol</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">HDL Cholesterol</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Hemoglobin A1C</span>
            </div>
          </div>
        </div>

        {/* Simple Chart Representation */}
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>240</span>
            <span>180</span>
            <span>120</span>
            <span>60</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-t border-gray-100"></div>
              ))}
            </div>

            {/* Chart lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240">
              {/* Total Cholesterol line (blue) */}
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                points="50,80 200,85 350,90"
              />
              <circle cx="50" cy="80" r="4" fill="#3B82F6" />
              <circle cx="200" cy="85" r="4" fill="#3B82F6" />
              <circle cx="350" cy="90" r="4" fill="#3B82F6" />

              {/* HDL Cholesterol line (green) */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                points="50,160 200,155 350,150"
              />
              <circle cx="50" cy="160" r="4" fill="#10B981" />
              <circle cx="200" cy="155" r="4" fill="#10B981" />
              <circle cx="350" cy="150" r="4" fill="#10B981" />

              {/* Hemoglobin A1C line (yellow) */}
              <polyline
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                points="50,190 200,185 350,195"
              />
              <circle cx="50" cy="190" r="4" fill="#F59E0B" />
              <circle cx="200" cy="185" r="4" fill="#F59E0B" />
              <circle cx="350" cy="195" r="4" fill="#F59E0B" />
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500">
            <span>15/01/2024</span>
            <span>15/04/2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTrendsOverview;
