import React, { useState, useEffect } from 'react';
import labReportService from '../services/labReportService';
import { toast } from 'react-toastify';

const AIHealthInsights = () => {
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHealthInsights();
  }, []);

  const loadHealthInsights = async () => {
    try {
      setLoading(true);
      const response = await labReportService.getHealthDashboard();
      
      if (response.success && response.data) {
        // Check if we have recommendations (from real backend) or need to generate from recentParameters
        if (response.data.recommendations) {
          const recs = response.data.recommendations;
          setRecommendations(recs);
          
          // Transform recommendations into insights format
          const transformedInsights = [];
          
          // Critical insights
          if (recs.critical && recs.critical.length > 0) {
            transformedInsights.push({
              type: 'critical',
              title: 'Critical Parameters',
              count: recs.critical.length,
              description: `${recs.critical.length} parameter(s) require immediate attention.`,
              recommendation: 'Seek immediate medical consultation.',
              parameters: recs.critical,
              color: 'red',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )
            });
          }

          // Attention needed insights
          if (recs.attention && recs.attention.length > 0) {
            transformedInsights.push({
              type: 'elevated',
              title: 'Elevated Parameters',
              count: recs.attention.length,
              description: `${recs.attention.length} parameter(s) are above normal range.`,
              recommendation: 'Consider lifestyle modifications and follow up with your doctor.',
              parameters: recs.attention,
              color: 'orange',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )
            });
          }

          // Normal parameters
          if (recs.normal && recs.normal.length > 0) {
            transformedInsights.push({
              type: 'positive',
              title: 'Normal Parameters',
              count: recs.normal.length,
              description: `${recs.normal.length} parameter(s) are within normal range.`,
              recommendation: 'Continue maintaining healthy lifestyle.',
              parameters: recs.normal,
              color: 'green',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )
            });
          }

          // Health score based on normal vs abnormal parameters
          const totalParams = response.data.recentParameters?.length || 0;
          const normalParams = recs.normal?.length || 0;
          const healthScore = totalParams > 0 ? Math.round((normalParams / totalParams) * 100) : 0;
          
          transformedInsights.push({
            type: 'score',
            title: `Health Score: ${healthScore}%`,
            count: normalParams,
            description: `${normalParams} out of ${totalParams} parameters are normal.`,
            recommendation: healthScore >= 70 
              ? 'Great job! Keep maintaining your healthy lifestyle.'
              : 'Focus on improving abnormal parameters with medical guidance.',
            parameters: [],
            color: healthScore >= 70 ? 'green' : healthScore >= 50 ? 'orange' : 'red',
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 7.707 12.379a1 1 0 101.414 1.414l3.5-3.5a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            )
          });

          setInsights(transformedInsights);
        } else if (response.data.recentParameters && response.data.recentParameters.length > 0) {
          // Generate insights from recentParameters if no recommendations provided
          const params = response.data.recentParameters;
          const critical = params.filter(p => p.status === 'critical' || p.status === 'critical_high' || p.status === 'critical_low');
          const attention = params.filter(p => p.status === 'high' || p.status === 'low' || p.status === 'abnormal');
          const normal = params.filter(p => p.status === 'normal');
          
          const transformedInsights = [];
          
          // Critical insights
          if (critical.length > 0) {
            transformedInsights.push({
              type: 'critical',
              title: 'Critical Parameters',
              count: critical.length,
              description: `${critical.length} parameter(s) require immediate attention.`,
              recommendation: 'Seek immediate medical consultation.',
              parameters: critical,
              color: 'red',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )
            });
          }

          // Attention needed insights
          if (attention.length > 0) {
            transformedInsights.push({
              type: 'elevated',
              title: 'Parameters Need Attention',
              count: attention.length,
              description: `${attention.length} parameter(s) are outside normal range.`,
              recommendation: 'Consider lifestyle modifications and follow up with your doctor.',
              parameters: attention,
              color: 'orange',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )
            });
          }

          // Normal parameters
          if (normal.length > 0) {
            transformedInsights.push({
              type: 'positive',
              title: 'Normal Parameters',
              count: normal.length,
              description: `${normal.length} parameter(s) are within normal range.`,
              recommendation: 'Continue maintaining healthy lifestyle.',
              parameters: normal,
              color: 'green',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )
            });
          }

          // Health score based on normal vs total parameters
          const totalParams = params.length;
          const normalParams = normal.length;
          const healthScore = totalParams > 0 ? Math.round((normalParams / totalParams) * 100) : 0;
          
          transformedInsights.push({
            type: 'score',
            title: `Health Score: ${healthScore}%`,
            count: normalParams,
            description: `${normalParams} out of ${totalParams} parameters are normal.`,
            recommendation: healthScore >= 70 
              ? 'Great job! Keep maintaining your healthy lifestyle.'
              : 'Focus on improving abnormal parameters with medical guidance.',
            parameters: [],
            color: healthScore >= 70 ? 'green' : healthScore >= 50 ? 'orange' : 'red',
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 7.707 12.379a1 1 0 101.414 1.414l3.5-3.5a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            )
          });

          setInsights(transformedInsights);
          setRecommendations({ critical, attention, normal });
        } else {
          // No parameters available
          setInsights([]);
          setRecommendations(null);
        }
      } else {
        setInsights([]);
        setRecommendations(null);
      }
    } catch (error) {
      console.error('Error loading health insights:', error);
      setError('Failed to load health insights');
      toast.error('Failed to load health insights');
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
          icon: 'text-red-500'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-600',
          icon: 'text-orange-500'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-600',
          icon: 'text-green-500'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-600',
          icon: 'text-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-600',
          icon: 'text-gray-500'
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
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
            onClick={loadHealthInsights}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
          <p className="text-gray-600 mb-4">Upload a lab report to get AI-powered health insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">AI Health Insights</h2>
        <p className="text-sm text-gray-600 mt-1">Personalized recommendations based on your lab results</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const colors = getColorClasses(insight.color);
            
            return (
              <div key={index} className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 ${colors.icon}`}>
                    {insight.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${colors.text}`}>
                        {insight.title}
                      </h3>
                      {insight.count > 0 && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {insight.count}
                        </span>
                      )}
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-600">
                      {insight.description}
                    </p>
                    
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {insight.recommendation}
                    </p>
                    
                    {insight.parameters && insight.parameters.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {insight.parameters.slice(0, 3).map((param, paramIndex) => (
                            <span
                              key={paramIndex}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-gray-700 border border-gray-200"
                            >
                              {typeof param === 'string' ? param : param.parameter || param.name || 'Unknown Parameter'}
                            </span>
                          ))}
                          {insight.parameters.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-gray-500 border border-gray-200">
                              +{insight.parameters.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* General Health Tips */}
        {recommendations && recommendations.tips && recommendations.tips.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Health Tips</h3>
            <ul className="space-y-2">
              {recommendations.tips.slice(0, 4).map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    {typeof tip === 'string' ? tip : tip.text || tip.message || tip.category || 'Health tip'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary */}
        {recommendations && recommendations.summary && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{recommendations.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHealthInsights;
