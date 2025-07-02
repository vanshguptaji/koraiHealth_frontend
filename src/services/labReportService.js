import api from '../config/api.js';

class LabReportService {
  
  // Upload lab report file
  async uploadLabReport(file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('labReport', file);

      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      };

      const response = await api.post('/lab-reports/upload', formData, config);
      
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to upload file. Please try again.');
    }
  }

  // Get all user's lab reports
  async getUserLabReports() {
    try {
      const response = await api.get('/lab-reports');
      console.log('Lab reports fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      
      // Handle 404 specifically - backend route not implemented yet
      if (error.response?.status === 404) {
        console.warn('Lab reports endpoint not implemented on backend yet');
        return { success: true, data: [] }; // Return empty array as fallback
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch lab reports');
    }
  }

  // Get extracted text from a report
  async getReportText(reportId) {
    try {
      const response = await api.get(`/lab-reports/${reportId}/text`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report text:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch report text');
    }
  }

  // Get health parameters from a specific report
  async getHealthParameters(reportId) {
    try {
      const response = await api.get(`/lab-reports/${reportId}/parameters`);
      console.log('Health parameters fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching health parameters:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch health parameters');
    }
  }

  // Get health trends for dashboard
  async getHealthTrends(parameterName = null, days = 30) {
    try {
      const params = new URLSearchParams();
      if (parameterName) params.append('parameterName', parameterName);
      params.append('days', days.toString());

      const response = await api.get(`/lab-reports/trends?${params.toString()}`);
      console.log('Health trends fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching health trends:', error);
      
      // Handle 404 - backend endpoint not implemented yet
      if (error.response?.status === 404) {
        console.warn('Health trends endpoint not implemented on backend yet');
        console.log('Returning sample trends data for demonstration');
        return this.getSampleTrendsData();
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch health trends');
    }
  }

  // Get health dashboard data
  async getHealthDashboard() {
    try {
      const response = await api.get('/lab-reports/dashboard');
      console.log('Health dashboard data fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching health dashboard:', error);
      
      // Handle 404 - backend endpoint not implemented yet
      if (error.response?.status === 404) {
        console.warn('Health dashboard endpoint not implemented on backend yet');
        console.log('Returning sample data for demonstration');
        return this.getSampleDashboardData();
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch health dashboard data');
    }
  }

  // Delete a lab report
  async deleteLabReport(reportId) {
    try {
      const response = await api.delete(`/lab-reports/${reportId}`);
      console.log('Lab report deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting lab report:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to delete lab report');
    }
  }

  // Get file types summary
  async getFileTypesSummary() {
    try {
      const response = await api.get('/lab-reports/types');
      return response.data;
    } catch (error) {
      console.error('Error fetching file types:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch file types summary');
    }
  }

  // Retry text extraction for a report
  async retryTextExtraction(reportId) {
    try {
      const response = await api.post(`/lab-reports/${reportId}/retry-extraction`);
      return response.data;
    } catch (error) {
      console.error('Error retrying text extraction:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to retry text extraction');
    }
  }

  // Get sample data for demonstration (when backend is not available)
  getSampleDashboardData() {
    return {
      success: true,
      data: {
        totalReports: 3,
        parametersAnalyzed: 15,
        trendsAvailable: 8,
        lastUpload: new Date().toISOString(),
        recentInsights: [
          "Your cholesterol levels have improved by 12% this month",
          "Blood sugar levels are stable within normal range",
          "Recommend increasing vitamin D intake"
        ],
        latestParameters: [
          {
            name: "Total Cholesterol",
            value: 180,
            unit: "mg/dL",
            referenceRange: { min: 150, max: 200 },
            status: "normal",
            category: "lipid",
            createdAt: new Date().toISOString(),
            reportId: "sample1"
          },
          {
            name: "Blood Glucose",
            value: 95,
            unit: "mg/dL", 
            referenceRange: { min: 70, max: 100 },
            status: "normal",
            category: "diabetes",
            createdAt: new Date().toISOString(),
            reportId: "sample1"
          },
          {
            name: "Hemoglobin",
            value: 14.2,
            unit: "g/dL",
            referenceRange: { min: 12, max: 16 },
            status: "normal", 
            category: "blood",
            createdAt: new Date().toISOString(),
            reportId: "sample1"
          },
          {
            name: "LDL Cholesterol",
            value: 125,
            unit: "mg/dL",
            referenceRange: { max: 100 },
            status: "high",
            category: "lipid", 
            createdAt: new Date().toISOString(),
            reportId: "sample1"
          },
          {
            name: "Vitamin D",
            value: 18,
            unit: "ng/mL",
            referenceRange: { min: 30, max: 100 },
            status: "low",
            category: "other",
            createdAt: new Date().toISOString(), 
            reportId: "sample1"
          }
        ],
        recommendations: {
          critical: [],
          attention: [
            {
              name: "LDL Cholesterol",
              value: 125,
              reason: "Above recommended level"
            },
            {
              name: "Vitamin D", 
              value: 18,
              reason: "Below normal range"
            }
          ],
          normal: [
            {
              name: "Total Cholesterol",
              value: 180
            },
            {
              name: "Blood Glucose",
              value: 95
            },
            {
              name: "Hemoglobin", 
              value: 14.2
            }
          ]
        }
      }
    };
  }

  // Get sample trends data for demonstration
  getSampleTrendsData() {
    const today = new Date();
    const generateTrendData = (baseValue, variance, trend = 0) => {
      const dataPoints = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const trendEffect = trend * (29 - i) * 0.1;
        const randomVariance = (Math.random() - 0.5) * variance;
        const value = baseValue + trendEffect + randomVariance;
        dataPoints.push({
          date: date.toISOString(),
          value: Math.max(0, value),
          unit: "mg/dL"
        });
      }
      return dataPoints;
    };

    return {
      success: true,
      data: {
        trendData: {
          "Total Cholesterol": generateTrendData(185, 10, -0.5),
          "Blood Glucose": generateTrendData(92, 5, 0.2),
          "LDL Cholesterol": generateTrendData(128, 8, -0.8),
          "Hemoglobin": generateTrendData(14.1, 0.3, 0.1)
        }
      },
      trends: []
    };
  }
}

// Create and export a single instance
const labReportService = new LabReportService();
export default labReportService;
