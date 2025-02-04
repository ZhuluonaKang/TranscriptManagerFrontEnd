import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ResultTable.css'; 

const ResultTable = ({ data }) => {
  if (!data.queried_data || data.queried_data.length === 0) {
    return <p className="no-results">No results to display. Make sure the correct name is entered or try searching with different criteria.</p>;
  }

  // Count the total number of valid "Course Details" (excluding "N/A")
  const totalCourseDetails = data.queried_data.reduce((count, row) => {
    return row["Course Details"] !== "N/A" ? count + 1 : count;
  }, 0);

  return (
    <div className="result-table-container">
      <label className="educator-label">{data.educator_name}</label>
      <table className="result-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Course Details</th>
          </tr>
        </thead>
        <tbody>
          {data.queried_data.map((row, index) => (
            <tr key={index}>
              <td>{row["Category"]}</td>
              <td>{row["Course Details"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render total count of valid "Course Details" */}
      <div className="total-course-count">
        <h3>Total Valid Courses: {totalCourseDetails}</h3>
      </div>
      
      <p className="notes">{data.notes}</p>
    </div>

  );
};

// Define prop types for type safety
ResultTable.propTypes = {
  data: PropTypes.shape({
    educator_name: PropTypes.string,
    queried_data: PropTypes.arrayOf(
      PropTypes.shape({
        Category: PropTypes.string.isRequired,
        "Course Details": PropTypes.string.isRequired,
      })
    ),
    notes: PropTypes.string,
  }).isRequired,
};

export default ResultTable;
