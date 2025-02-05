import axios from 'axios';

// Set the base URL for API calls. FastAPI runs on port 8000 by default.
const API_URL = process.env.REACT_API_URL || 'http://localhost:8000';


export const fetchCourseCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/course-categories`);
    return response.data.course_categories;
  } catch (error) {
    console.error("Error fetching course categories:", error);
    return [];
  }
};


/**
 * Upload a file to the backend
 * @param {File} file - The file to be uploaded
 * @returns {Promise<Object>} - The processed file data
 */
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('files', file);

  try {
    return axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onProgress) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          onProgress(percentCompleted);
        }
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};


/**
 * Search data in the backend
 * @param {Object} criteria - The search criteria
 * @returns {Promise<Array>} - The search results
 */
export const searchData = async (criteria) => {
  try {
    console.log(criteria);
    const response = await axios.post(`${API_URL}/search`, {
      educator_name: criteria.name,
      course_category: criteria.courseCategory,
      education_level: criteria.educationLevel,
    });
    return response.data;
  } catch (error) {
    console.error('Error searching data:', error);
    throw error;
  }
};
