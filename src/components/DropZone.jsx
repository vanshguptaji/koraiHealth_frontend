import React, { useState, useCallback } from 'react';

const DropZone = ({ onFileSelect, uploading = false, uploadProgress = 0 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!uploading) {
      setIsDragOver(true);
    }
  }, [uploading]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (uploading) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, uploading]);

  const handleFileInput = useCallback((e) => {
    if (uploading) return;
    
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, uploading]);

  const handleBrowseClick = () => {
    if (!uploading) {
      document.getElementById('file-input').click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Upload Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>
        </div>

        {/* Main Text */}
        <div className="mb-4">
          {uploading ? (
            <div className="space-y-3">
              <p className="text-lg text-blue-600 font-medium">
                Uploading and analyzing...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {uploadProgress}% complete
              </p>
            </div>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-2">
                Choose a file or drag it here
              </p>
              {selectedFile && (
                <p className="text-sm text-green-600 font-medium">
                  Selected: {selectedFile.name}
                </p>
              )}
            </>
          )}
        </div>

        {/* File Format Support */}
        <p className="text-sm text-gray-500 mb-6">
          Supports PDF, PNG, JPG, JPEG, WEBP (Max 10MB)
        </p>

        {/* Browse Files Button */}
        <button
          onClick={handleBrowseClick}
          disabled={uploading}
          className={`px-6 py-3 border border-gray-300 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            uploading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {uploading ? 'Processing...' : 'Browse Files'}
        </button>

        {/* Hidden File Input */}
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={handleFileInput}
        />
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {/* Smart Extraction Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">Smart Extraction</h3>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            Advanced OCR technology extracts all health parameters from your reports automatically.
          </p>
        </div>

        {/* Trend Analysis Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">Trend Analysis</h3>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            Track your health journey with interactive charts and historical comparisons.
          </p>
        </div>

        {/* AI Insights Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">AI Insights</h3>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            Get personalized health insights and recommendations powered by medical AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;