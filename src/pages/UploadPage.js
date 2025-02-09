import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../apiServices';
import '../styles/UploadPage.css';
import '../styles/ReturnButton.css';


const UploadPage = () => {
  const navigate = useNavigate(); 

  const [uploadedFiles, setUploadedFiles] = useState({ valid: [], invalid: [] }); // Store valid & invalid files separately
  const [uploadStatus, setUploadStatus] = useState(''); // Track upload status messages
  const [progress, setProgress] = useState({}); // Track individual file upload progress

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
    setUploadedFiles({ valid: validFiles, invalid: invalidFiles });

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

      // Upload each file sequentially
      for (const file of validFiles) {
        await uploadSingleFile(file);
      }

      setUploadStatus('All uploads completed!');
    }
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

  const handleGoBack = () => {
    navigate('/'); 
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
      {uploadedFiles.invalid.length > 0 && (
        <div className="error-text">
          <p>Invalid Files:</p>
          <ul>
            {uploadedFiles.invalid.map((file, index) => (
              <li key={index}>{file.name} - {file.reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display upload status for any valid files */}
      {uploadedFiles.valid.length > 0 && uploadStatus && (
        <p className={uploadStatus.startsWith('Error') ? 'error-text' : 'success-text'}>
          {uploadStatus}
        </p>
      )}

      {/* Progress Bar */}
      {uploadedFiles.valid.length > 0 && (
        <div>
          <ul>
            {uploadedFiles.valid.map((file, index) => (
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
      {/* ⑧ Return to Home Button */}
      <button className="back-btn" onClick={handleGoBack}>
        Return to Home
      </button>
    </div>
  );
}



export default UploadPage;
