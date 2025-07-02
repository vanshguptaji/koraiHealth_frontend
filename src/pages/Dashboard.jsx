import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import HealthParametersTable from '../components/HealthParametersTable';
import AIHealthInsights from '../components/AIHealthInsights';
import HealthTrendsOverview from '../components/HealthTrendsOverview';
import FileUploadHistory from '../components/FileUploadHistory';
import DashboardSummary from '../components/DashboardSummary';

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Check if we're coming from a successful upload
    if (location.state?.uploadSuccess) {
      const { uploadResult } = location.state;
      
      // Show a welcome message for the newly uploaded data
      if (uploadResult?.parametersFound > 0) {
        toast.success(`Welcome to your dashboard! Your latest report with ${uploadResult.parametersFound} parameters is now available.`, {
          position: "top-center",
          autoClose: 4000,
        });
      }
      
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Dashboard Summary */}
          <DashboardSummary key={`summary-${user?._id || 'guest'}`} />

          {/* Health Parameters Table */}
          <HealthParametersTable key={`health-params-${user?._id || 'guest'}-${location.state?.timestamp || 'default'}`} />

          {/* Two Column Layout for Insights and Trends */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Health Insights */}
            <div>
              <AIHealthInsights key={`ai-insights-${user?._id || 'guest'}-${location.state?.timestamp || 'default'}`} />
            </div>

            {/* Health Trends Overview */}
            <div>
              <HealthTrendsOverview key={`health-trends-${user?._id || 'guest'}-${location.state?.timestamp || 'default'}`} />
            </div>
          </div>

          {/* File Upload History */}
          <FileUploadHistory key={`upload-history-${user?._id || 'guest'}-${location.state?.timestamp || 'default'}`} />

          {/* Dashboard Summary - New Component Added */}
          <DashboardSummary key={`dashboard-summary-${location.state?.timestamp || 'default'}`} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;