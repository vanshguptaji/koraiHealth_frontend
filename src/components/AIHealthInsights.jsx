import React from 'react';

const AIHealthInsights = () => {
  const insights = [
    {
      type: 'elevated',
      title: 'Elevated Parameters',
      count: 4,
      description: '4 parameter(s) are above normal range.',
      recommendation: 'Consider lifestyle modifications and follow up with your doctor.',
      parameters: ['Total Cholesterol', 'LDL Cholesterol', 'Hemoglobin A1C', 'Fasting Glucose'],
      color: 'orange',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      type: 'below',
      title: 'Below Normal Parameters',
      count: 1,
      description: '1 parameter(s) are below normal range.',
      recommendation: 'Monitor these values and discuss with your healthcare provider.',
      parameters: ['Vitamin D'],
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      type: 'positive',
      title: 'Positive Trends Detected',
      count: 2,
      description: '2 elevated parameter(s) showing improvement.',
      recommendation: 'Continue current treatment and lifestyle changes.',
      parameters: ['Total Cholesterol', 'LDL Cholesterol'],
      color: 'green',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      type: 'score',
      title: 'Health Score: 17%',
      count: 1,
      description: '1 out of 6 parameters are within normal range.',
      recommendation: 'Focus on improving parameters outside normal range.',
      parameters: [],
      color: 'orange',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          title: 'text-orange-700'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-700'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          title: 'text-green-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-700'
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h2 className="text-xl font-bold text-blue-600">AI Health Insights</h2>
      </div>

      <div className="grid gap-4">
        {insights.map((insight, index) => {
          const colors = getColorClasses(insight.color);
          
          return (
            <div
              key={index}
              className={`${colors.bg} ${colors.border} border rounded-lg p-4 relative`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className={`${colors.icon} mr-2`}>
                    {insight.icon}
                  </div>
                  <h3 className={`font-semibold ${colors.title}`}>{insight.title}</h3>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  AI Generated
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3">{insight.description}</p>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Recommendation:</p>
                <p className="text-sm text-gray-600">{insight.recommendation}</p>
              </div>

              {insight.parameters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {insight.parameters.map((param, paramIndex) => (
                    <span
                      key={paramIndex}
                      className="text-xs bg-white border border-gray-200 px-2 py-1 rounded font-medium text-gray-700"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Health Monitoring Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-700 mb-1">Health Monitoring Tip</h4>
            <p className="text-blue-600 text-sm">
              Regular monitoring of your health parameters helps identify trends early. Consider scheduling follow-up tests based on your healthcare provider's recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHealthInsights;
