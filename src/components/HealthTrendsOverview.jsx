import React from 'react';

const HealthTrendsOverview = () => {
  const trendData = [
    {
      parameter: 'Total Cholesterol',
      currentValue: '220.00',
      trend: 'decreasing',
      trendPercentage: '-4.3%',
      color: 'red',
      chartColor: '#3B82F6',
      trendIcon: '↘'
    },
    {
      parameter: 'HDL Cholesterol',
      currentValue: '45.00',
      trend: 'increasing',
      trendPercentage: '+7.1%',
      color: 'green',
      chartColor: '#10B981',
      trendIcon: '↗'
    },
    {
      parameter: 'Hemoglobin A1C',
      currentValue: '6.80',
      trend: 'decreasing',
      trendPercentage: '-1.4%',
      color: 'red',
      chartColor: '#F59E0B',
      trendIcon: '↘'
    }
  ];

  const getTrendColor = (trend) => {
    return trend === 'increasing' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendBgColor = (trend) => {
    return trend === 'increasing' ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-600">Health Trends Overview</h2>
      
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
