import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { fetchCourseCategories } from '../apiServices';
import '../styles/SearchCriteria.css';

function SearchCriteria({ criteria, setCriteria, handleSearch }) {
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categories = await fetchCourseCategories();
        setCourseCategories(categories || []); // Store fetched categories in state
      } catch (error) {
        console.error("Failed to fetch course categories:", error);
      }
    };
    getCategories(); // Fetch categories on component mount
  }, []);

  const EDUCATION_LEVELS = ['Bachelor', 'Master', 'Doctorate'];

  // Handles input change
  const handleInputChange = (field, value) => {
    setCriteria((prevData) => ({...prevData, [field]: value }));
  };

  // Handles checkbox selection for education levels
  const handleEducationChange = (level) => {
    const updatedEducationLevels = criteria.educationLevel.includes(level)
      ? criteria.educationLevel.filter((item) => item !== level)
      : [...criteria.educationLevel, level];

    setCriteria({ ...criteria, educationLevel: updatedEducationLevels });
  };

  return (
    <div className="search-container">
      {/* Search input */}
      <input
        type="text"
        className="search-input"
        value={criteria.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Enter a Faculty's Full Name"
        required
      /><span className="required">*</span>


      {/* Dropdown menu */}
      <div className="dropdown-container">
        <select
          className="dropdown-select"
          value={criteria.courseCategory}
          onChange={(e) => handleInputChange('courseCategory', e.target.value)}
        >
          <option value="">Select a Course Category</option>
          {courseCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Checkbox group for selecting education levels */}
      <div className="checkbox-container">
        <label className="checkbox-title">Education Level:</label>
        <div className="checkbox-group">
          {EDUCATION_LEVELS.map((level, index) => (
            <label key={index} className="checkbox-label">
              <input
                type="checkbox"
                value={level}
                checked={criteria.educationLevel.includes(level)}
                onChange={() => handleEducationChange(level)}
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      {/* Search button */}
      <button className="search-btn" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

// Define prop types for type safety
SearchCriteria.propTypes = {
  criteria: PropTypes.shape({
    name: PropTypes.string,
    courseCategory: PropTypes.string,
    educationLevel: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setCriteria: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default SearchCriteria;
