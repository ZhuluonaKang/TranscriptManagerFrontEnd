import React, { useState } from 'react';
import { uploadFiles } from '../apiServices';
import BackToHomeButton from '../components/BackToHomeButton';
import '../styles/UploadPage.css';

const UploadPage = () => {
  const [toBeUploadedFiles, setToBeUploadedFiles] = useState({ valid: [], invalid: [] }); // Store valid & invalid files separately
  const [uploadStatus, setUploadStatus] = useState(''); // Track upload status messages
  const [progress, setProgress] = useState({}); // Track individual file upload progress
  const [results, setResults] = useState({}); // Stores backend responses per file

  // File upload restrictions
  const maxFileSize = 5 * 1024 * 1024; // 5MB limit per file
  const maxFileCount = 100; // Maximum number of files allowed
  const allowedTypes = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png']; // Allowed file types

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
        invalidFiles.push({
          name: file.name,
          reason: !allowedTypes.includes(file.type)
            ? 'Unsupported format'
            : 'File size exceeds 5MB',
        });
      } else {
        validFiles.push(file);
      }
    });

    // Store valid and invalid files separately
    setToBeUploadedFiles({ valid: validFiles, invalid: invalidFiles });

    // Display errors for invalid files
    if (invalidFiles.length > 0) {
      setUploadStatus(
        `Error:\n${invalidFiles.map((file) => `${file.name} - ${file.reason}`).join('\n')}`
      );
    }

    // Proceed with uploading valid files if any exist
    if (validFiles.length > 0) {
      setUploadStatus('Uploading...');
      
      // Initialize progress tracking
      const progressMap = {};
      validFiles.forEach((file) => (progressMap[file.name] = 0));
      setProgress(progressMap);

      // Upload files to the backend
      const results = await uploadFiles(validFiles, (percentCompleted, fileName) => {
        setProgress((prevProgress) => ({
          ...prevProgress,
          [fileName]: percentCompleted,
        }));
      });

      // Map backend responses to each file
      const resultsMap = {};
      results.forEach((result) => {
        resultsMap[result.filename] = result;
      });
      setResults(resultsMap);
      setUploadStatus('All uploads completed!');
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

      {/* Display errors for any invalid files */}
      {toBeUploadedFiles.invalid.length > 0 && (
        <div className="error-text">
          <p>Invalid Files:</p>
          <ul>
            {toBeUploadedFiles.invalid.map((file, index) => (
              <li key={index}>{file.name} - {file.reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display upload status for any valid files */}
      {toBeUploadedFiles.valid.length > 0 && uploadStatus && (
        <p className={uploadStatus.startsWith('Error') ? 'error-text' : 'success-text'}>
          {uploadStatus}
        </p>
      )}

      
      {toBeUploadedFiles.valid.length > 0 && (
        <div>
          <ul>
            {toBeUploadedFiles.valid.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)

                {/* Display backend response per file if available */}
                {results[file.name] && results[file.name].status === "error" && (
                  <p className="error-text">
                    {results[file.name].message}
                  </p>
                )}

                {/* Progress Bar */}
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

      {/* Return back to home page button */}
      <BackToHomeButton />
    </div>
  );
}

export default UploadPage;
