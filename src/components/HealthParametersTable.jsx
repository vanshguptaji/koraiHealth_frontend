import React, { useState } from 'react';

const HealthParametersTable = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const healthData = [
    {
      parameter: 'Fasting Glucose',
      value: '110.00',
      unit: 'mg/dL',
      referenceRange: '70-99',
      status: 'High',
      category: 'Diabetes',
      trend: 'up'
    },
    {
      parameter: 'HDL Cholesterol',
      value: '45.00',
      unit: 'mg/dL',
      referenceRange: '> 40',
      status: 'Normal',
      category: 'Lipids',
      trend: 'up'
    },
    {
      parameter: 'Hemoglobin A1C',
      value: '6.80',
      unit: '%',
      referenceRange: '< 5.7',
      status: 'High',
      category: 'Diabetes',
      trend: 'stable'
    },
    {
      parameter: 'LDL Cholesterol',
      value: '150.00',
      unit: 'mg/dL',
      referenceRange: '< 100',
      status: 'High',
      category: 'Lipids',
      trend: 'down'
    },
    {
      parameter: 'Total Cholesterol',
      value: '220.00',
      unit: 'mg/dL',
      referenceRange: '< 200',
      status: 'High',
      category: 'Lipids',
      trend: 'down'
    },
    {
      parameter: 'Vitamin D',
      value: '25.00',
      unit: 'ng/mL',
      referenceRange: '30-100',
      status: 'Low',
      category: 'Vitamins',
      trend: 'up'
    }
  ];

  const filters = ['All', 'Lipids', 'Diabetes', 'Vitamins'];

  const filteredData = activeFilter === 'All' 
    ? healthData 
    : healthData.filter(item => item.category === activeFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Normal': return 'text-green-600 bg-green-100';
      case 'Low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'High': 
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'Normal':
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'Low':
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default: return null;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <span className="text-red-500">↗</span>;
      case 'down':
        return <span className="text-red-500">↘</span>;
      case 'stable':
        return <span className="text-gray-500">→</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-blue-600">Health Parameters</h2>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Parameter
                <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Value</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Reference Range</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{item.parameter}</span>
                    <span className="ml-2">{getTrendIcon(item.trend)}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="font-semibold text-gray-900">{item.value}</span>
                  <span className="text-gray-500 ml-1">{item.unit}</span>
                </td>
                <td className="py-4 px-4 text-gray-600">{item.referenceRange}</td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HealthParametersTable;
