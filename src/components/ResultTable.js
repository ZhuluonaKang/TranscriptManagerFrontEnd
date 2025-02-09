import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ResultTable.css'; 

const ResultTable = ({ data, totalEducators }) => {
  const { queried_data, educator_name, notes } = data; 

  if (!queried_data || queried_data.length === 0) {
    return <p className="no-results">No results to display. Make sure the correct name is entered or try searching with different criteria.</p>;
  }

  // Function to count the total number of valid "Course Details" (excluding "N/A")
  const totalCourseDetails = queried_data.reduce(
    (count, row) => ( row["Course Details"] !== "N/A" ? count + 1 : count ), 
    0
  );

  // Function to format notes into multiple lines (Splitting at numbers or manually adding breaks)
  const formattedNotes = notes
    .replace(/(\d+\.)/g, "\n$1")
    .split("\n") 
    .map((line, index) => <p key={index}>{line.trim()}</p>);

  return (
    <div className="result-table-container">
      <label className="educator-label">
        {educator_name ? educator_name : `Total Unique Faculties: ${totalEducators}`}
      </label>
      
      <table className="result-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Course Details</th>
          </tr>
        </thead>
        <tbody>
          {queried_data.map((row, index) => (
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
      
      {/* Render formatted notes */}
      {formattedNotes && <div className="notes"><ul>{formattedNotes}</ul></div>}
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
  totalEducators: PropTypes.number.isRequired,
};

export default ResultTable;
