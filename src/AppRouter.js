import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QueryPage from './pages/QueryPage';
import UploadPage from './pages/UploadPage';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/query" element={<QueryPage />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
