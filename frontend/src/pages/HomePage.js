import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  return (
    <div className="container">
      <h1>WU Transcript Manager</h1>
      <p>Welcome to the Westcliff University Transcript Manager!</p>
      <p> Choose a feature to get started:</p>
      
      <div className="button-container">
        {/* Upload Button - Navigates to /upload */}
        <button className="upload-button" onClick={() => navigate('/upload')}>
          Upload
        </button>

        {/* Query Button - Navigates to /query */}
        <button className="query-button" onClick={() => navigate('/query')}>
          Query
        </button>
      </div>
    </div>
  );
}

export default HomePage;
