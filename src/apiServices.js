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
export const uploadFiles = async (files, onProgress) => {
  const formData = new FormData();
  
  // Append multiple files (backend expects "files")
  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (onProgress) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          
          // Assign progress to the correct file
          files.forEach((file) => {
            onProgress(percentCompleted, file.name);
          });
        }
      },
    });

    // Extract structured response
    if (response.data && response.data.processed_files) {
      return response.data.processed_files;
    } else {
      throw new Error("Unexpected response format from server.");
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    return [{ status: "error", message: "File upload failed. Please try again." }];
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
      educator_firstName: criteria.firstName,
      educator_lastName: criteria.lastName,
      course_category: criteria.courseCategory,
      education_level: criteria.educationLevel,
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error searching data:', error);
    throw error;
  }
};
