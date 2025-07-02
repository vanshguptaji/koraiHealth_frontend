import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import HealthParametersTable from '../components/HealthParametersTable';
import AIHealthInsights from '../components/AIHealthInsights';
import HealthTrendsOverview from '../components/HealthTrendsOverview';
import FileUploadHistory from '../components/FileUploadHistory';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Health Parameters Table */}
          <HealthParametersTable />

          {/* Two Column Layout for Insights and Trends */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Health Insights */}
            <div>
              <AIHealthInsights />
            </div>

            {/* Health Trends Overview */}
            <div>
              <HealthTrendsOverview />
            </div>
          </div>

          {/* File Upload History */}
          <FileUploadHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;