import React from 'react';

const TrendChart = ({ trendData, selectedPeriod }) => {
  if (!trendData || trendData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Health Parameter Trends</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-600">No trend data available yet</p>
        </div>
      </div>
    );
  }

  // Select key parameters to display in chart (max 4 for clarity)
  const keyParameters = trendData.slice(0, 4);
  
  // Colors for different parameters
  const colors = [
    { stroke: '#3B82F6', fill: '#3B82F6' }, // Blue
    { stroke: '#10B981', fill: '#10B981' }, // Green
    { stroke: '#F59E0B', fill: '#F59E0B' }, // Amber
    { stroke: '#EF4444', fill: '#EF4444' }  // Red
  ];

  // Calculate chart dimensions
  const chartWidth = 400;
  const chartHeight = 200;
  const padding = 40;

  // Find min and max values for scaling
  const allValues = keyParameters.flatMap(param => 
    param.dataPoints.map(point => point.value)
  );
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue || 1;

  // Generate Y-axis labels
  const yAxisLabels = [];
  for (let i = 0; i <= 4; i++) {
    const value = minValue + (valueRange * i / 4);
    yAxisLabels.push(value.toFixed(1));
  }

  // Scale value to chart coordinates
  const scaleValue = (value) => {
    return chartHeight - padding - ((value - minValue) / valueRange) * (chartHeight - 2 * padding);
  };

  // Scale x position based on data points
  const scaleX = (index, totalPoints) => {
    return padding + (index / Math.max(totalPoints - 1, 1)) * (chartWidth - 2 * padding);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Health Parameter Trends</h3>
      
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4">
        {keyParameters.map((param, index) => (
          <div key={param.parameter} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: colors[index]?.stroke }}
            ></div>
            <span className="text-gray-600">
              {param.parameter} ({param.unit})
            </span>
            <span className="ml-2 font-medium" style={{ color: colors[index]?.stroke }}>
              {param.currentValue} {param.unit}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 pr-2">
          {yAxisLabels.reverse().map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-12">
          <svg width={chartWidth} height={chartHeight + 40} viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + (i * (chartHeight - 2 * padding) / 4)}
                x2={chartWidth - padding}
                y2={padding + (i * (chartHeight - 2 * padding) / 4)}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}

            {/* Parameter lines */}
            {keyParameters.map((param, paramIndex) => {
              if (!param.dataPoints || param.dataPoints.length === 0) return null;

              const points = param.dataPoints.map((point, index) => 
                `${scaleX(index, param.dataPoints.length)},${scaleValue(point.value)}`
              ).join(' ');

              return (
                <g key={param.parameter}>
                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke={colors[paramIndex]?.stroke}
                    strokeWidth="2"
                    points={points}
                  />
                  
                  {/* Data points */}
                  {param.dataPoints.map((point, index) => (
                    <circle
                      key={index}
                      cx={scaleX(index, param.dataPoints.length)}
                      cy={scaleValue(point.value)}
                      r="4"
                      fill={colors[paramIndex]?.fill}
                    />
                  ))}
                </g>
              );
            })}

            {/* X-axis */}
            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke="#d1d5db"
              strokeWidth="1"
            />

            {/* Y-axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="#d1d5db"
              strokeWidth="1"
            />

            {/* X-axis labels (dates) */}
            {keyParameters[0]?.dataPoints?.map((point, index) => (
              <text
                key={index}
                x={scaleX(index, keyParameters[0].dataPoints.length)}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {point.date}
              </text>
            )) || []}
          </svg>
        </div>
      </div>

      {/* Chart footer with summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <p>
            Showing trends for the last{' '}
            <span className="font-medium">
              {selectedPeriod === 365 ? '1 year' : `${selectedPeriod} days`}
            </span>
          </p>
          {keyParameters.length > 0 && (
            <p className="mt-1">
              Latest readings from {keyParameters[0]?.dataPoints?.[keyParameters[0].dataPoints.length - 1]?.date}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
