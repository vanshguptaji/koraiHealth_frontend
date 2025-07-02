import React, { useState, useEffect } from 'react';
import labReportService from '../services/labReportService';
import { toast } from 'react-toastify';

const FileUploadHistory = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await labReportService.getUserLabReports();
      
      if (response.success && response.data) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      setError('Failed to load uploaded files');
      toast.error('Failed to load uploaded files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await labReportService.deleteLabReport(fileId);
      toast.success('File deleted successfully');
      loadFiles(); // Reload the list
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (mimeType) => {
    if (mimeType === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    } else if (mimeType.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
            onClick={loadFiles}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload History</h3>
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Files Uploaded</h4>
          <p className="text-gray-600">Upload your first lab report to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Upload History</h3>
        <span className="text-sm text-gray-500">{files.length} file(s)</span>
      </div>

      <div className="space-y-4">
        {files.map((file) => (
          <div key={file._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {getFileTypeIcon(file.mimeType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.originalName}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span>•</span>
                  <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                  {file.extracted && (
                    <>
                      <span>•</span>
                      <span className="text-green-600">✓ Text Extracted</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="View file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </a>
              
              <button
                onClick={() => handleDelete(file._id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadHistory;
