import api from '../config/api.js';

class LabReportService {
  
  // Upload lab report file
  async uploadLabReport(file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);

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

      const response = await api.get(`/lab-reports/health/trends?${params.toString()}`);
      console.log('Health trends fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching health trends:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch health trends');
    }
  }

  // Get health dashboard data
  async getHealthDashboard() {
    try {
      const response = await api.get('/lab-reports/health/dashboard');
      console.log('Health dashboard data fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching health dashboard:', error);
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
}

// Create and export a single instance
const labReportService = new LabReportService();
export default labReportService;
