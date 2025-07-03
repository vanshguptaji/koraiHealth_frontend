import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import labReportService from '../services/labReportService';

const HealthCategorySummary = () => {
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, [user?._id]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      const response = await labReportService.getHealthTrends(null, 30);
      
      if (response.success && response.data && response.data.parameters) {
        // Group parameters by category
        const categoryGroups = response.data.parameters.reduce((groups, param) => {
          const category = param.category || 'general';
          if (!groups[category]) {
            groups[category] = {
              name: category,
              parameters: [],
              normal: 0,
              high: 0,
              low: 0,
              total: 0
            };
          }
          
          groups[category].parameters.push(param);
          groups[category].total++;
          
          if (param.status === 'normal') groups[category].normal++;
          else if (param.status === 'high') groups[category].high++;
          else if (param.status === 'low') groups[category].low++;
          
          return groups;
        }, {});

        setCategoryData(Object.values(categoryGroups));
      }
    } catch (error) {
      console.error('Error loading category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      lipid: '🩸',
      diabetes: '🍯',
      thyroid: '🦋',
      liver: '🫀',
      kidney: '🫘',
      heart: '❤️',
      general: '📊'
    };
    return icons[category] || icons.general;
  };

  const getCategoryColor = (category) => {
    const colors = {
      lipid: 'bg-red-50 border-red-200 text-red-800',
      diabetes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      thyroid: 'bg-purple-50 border-purple-200 text-purple-800',
      liver: 'bg-green-50 border-green-200 text-green-800',
      kidney: 'bg-blue-50 border-blue-200 text-blue-800',
      heart: 'bg-pink-50 border-pink-200 text-pink-800',
      general: 'bg-gray-50 border-gray-200 text-gray-800'
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Health Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categoryData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Health Categories</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-600">No health categories available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Health Categories</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryData.map((category) => {
          const normalPercentage = category.total > 0 ? (category.normal / category.total) * 100 : 0;
          
          return (
            <div 
              key={category.name} 
              className={`border rounded-lg p-4 ${getCategoryColor(category.name)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getCategoryIcon(category.name)}</span>
                  <h4 className="font-medium capitalize">{category.name}</h4>
                </div>
                <span className="text-sm font-bold">{category.total}</span>
              </div>

              {/* Status distribution */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Normal</span>
                  <span className="font-medium">{category.normal}</span>
                </div>
                
                {category.high > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>High</span>
                    <span className="font-medium text-red-600">{category.high}</span>
                  </div>
                )}
                
                {category.low > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Low</span>
                    <span className="font-medium text-yellow-600">{category.low}</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="w-full bg-white rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500" 
                    style={{ width: `${normalPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1">
                  {normalPercentage.toFixed(0)}% within normal range
                </p>
              </div>

              {/* Parameter list */}
              <div className="mt-3">
                <details className="group">
                  <summary className="text-xs text-gray-600 cursor-pointer group-open:text-gray-800">
                    View parameters
                  </summary>
                  <div className="mt-2 text-xs space-y-1">
                    {category.parameters.slice(0, 5).map((param, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="truncate">{param.name}</span>
                        <span className={`
                          px-1 py-0.5 rounded text-xs
                          ${param.status === 'normal' ? 'bg-green-100 text-green-800' : 
                            param.status === 'high' ? 'bg-red-100 text-red-800' :
                            param.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {param.status}
                        </span>
                      </div>
                    ))}
                    {category.parameters.length > 5 && (
                      <p className="text-gray-500">
                        +{category.parameters.length - 5} more
                      </p>
                    )}
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthCategorySummary;
