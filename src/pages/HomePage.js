import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="container">
            <h1>Transcript Manager</h1>
            <p>Welcome to the Transcript Manager! Choose a feature to get started:</p>
            <div className="button-container">
                <Link to="/upload">
                    <button className="primary-btn">Upload Transcript</button>
                </Link>
                <Link to="/query">
                    <button className="secondary-btn">Query and Download</button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;


