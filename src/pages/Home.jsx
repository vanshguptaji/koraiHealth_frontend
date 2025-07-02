import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import DropZone from '../components/DropZone';
import Navbar from '../components/Navbar';
import labReportService from '../services/labReportService';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (file) => {
    console.log('Selected file:', file);
    
    // If user is not authenticated, show toast and redirect to login
    if (!isAuthenticated) {
      toast.warning('Please login first to upload and analyze your lab reports.', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      navigate('/login', { 
        state: { 
          from: { pathname: '/dashboard' },
          message: 'Please sign in to upload and analyze your lab reports.'
        } 
      });
      return;
    }

    // Validate file size (10MB limit)
    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      toast.error(`File size must be less than ${maxSizeInMB}MB`, {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    // Validate file type
    const supportedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp'
    ];

    if (!supportedTypes.includes(file.type)) {
      toast.error('Please upload a supported file type (PDF, PNG, JPG, JPEG, WEBP)', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Show upload start toast
      toast.info('Uploading and analyzing your lab report...', {
        position: "top-center",
        autoClose: 2000,
      });

      // Upload file with progress tracking
      const result = await labReportService.uploadLabReport(file, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        // Show immediate success toast
        toast.success('Upload successful! Redirecting to your dashboard...', {
          position: "top-center",
          autoClose: 1500,
        });

        // Navigate to dashboard immediately with upload result data
        navigate('/dashboard', { 
          state: { 
            uploadSuccess: true,
            uploadResult: result.data,
            timestamp: Date.now()
          } 
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file. Please try again.', {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Lab Reports
            <br />
            <span className="text-blue-600">Into Actionable Insights</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your lab report and get instant AI-powered analysis with trends,
            insights, and personalized health recommendations.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-blue-600 text-center mb-2">
            Upload Your Lab Report
          </h3>
          <p className="text-gray-600 text-center mb-8">
            Drag and drop your PDF or image file, or click to browse
          </p>
          
          <DropZone 
            onFileSelect={handleFileSelect} 
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
        </div>

        {/* Features Section */}
        {/* <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Trend Analysis</h4>
            <p className="text-gray-600">Track your health metrics over time with visual trends and patterns.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Instant Insights</h4>
            <p className="text-gray-600">Get immediate AI-powered analysis of your lab results and key findings.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Health Recommendations</h4>
            <p className="text-gray-600">Receive personalized recommendations based on your lab results.</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;