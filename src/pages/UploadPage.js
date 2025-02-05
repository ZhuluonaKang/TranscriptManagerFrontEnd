import React, { useState } from 'react';
import { uploadFile } from '../apiServices';
import '../styles/UploadPage.css';

const UploadPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to track uploaded files
  const [uploadStatus, setUploadStatus] = useState(''); // State to track upload status messages
  const [progress, setProgress] = useState({}); // State to track individual file upload progress

  // File upload restrictions
  const maxFileSize = 5 * 1024 * 1024; // 5MB limit per file
  const maxFileCount = 100; // Maximum number of files allowed
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']; // Allowed file types

  // Handles file selection and validation
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    // Enforce max file count
    if (files.length > maxFileCount) {
      setUploadStatus(`Error: You can upload up to ${maxFileCount} files at a time.`);
      return;
    }

    // Filter out invalid files (wrong format or exceeding size limit)
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type) || file.size > maxFileSize) {
        invalidFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    // Show error messages for invalid files
    if (invalidFiles.length > 0) {
      const errors = invalidFiles.map((file) => {
        if (!allowedTypes.includes(file.type)) {
          return `${file.name} has an unsupported format.`;
        }
        if (file.size > maxFileSize) {
          return `${file.name} exceeds the maximum size of 5MB.`;
        }
        return null;
      });
      setUploadStatus(`Error:\n${errors.join('\n')}`);
      return;
    }

    // Start uploading valid files
    setUploadStatus('Uploading...');
    setUploadedFiles(validFiles);

    // Initialize progress tracking
    const progressMap = {};
    validFiles.forEach((file) => (progressMap[file.name] = 0));
    setProgress(progressMap);

    // Upload each file sequentially
    for (const file of validFiles) {
      await uploadSingleFile(file);
    }

    setUploadStatus('All uploads completed!');
  };

  // Upload a single file and update progress
  const uploadSingleFile = async (file) => {
    try {
      await uploadFile(file, (percentCompleted) => {
        setProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: percentCompleted,
        }));
      });

      setProgress((prevProgress) => ({
        ...prevProgress,
        [file.name]: 100,
      }));
    } catch (error) {
      setUploadStatus(`Error uploading ${file.name}: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h1>Upload Transcripts</h1>
      <p>Allowed formats: <strong>PDF, JPG, PNG</strong></p>
      <p>Maximum size: <strong>5MB</strong></p>
      <p>Max files: <strong>100</strong></p>
      
      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
        multiple
        onChange={handleFileUpload}
      />

      {uploadStatus && (
        <p className={uploadStatus.startsWith('Error') ? 'error-text' : 'success-text'}>
          {uploadStatus}
        </p>
      )}

      {uploadedFiles.length > 0 && (
        <div>
          <h3>Uploading Files:</h3>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${progress[file.name] || 0}%` }}
                    >
                      {Math.round(progress[file.name] || 0)}%
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}

export default UploadPage;
