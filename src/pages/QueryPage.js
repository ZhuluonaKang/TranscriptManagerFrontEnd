import React, { useCallback, useState} from 'react';
import { searchData } from '../apiServices'
import NotificationBar from '../components/NotificationBar';
import SearchCriteria from '../components/SearchCriteria';
import ResultTable from '../components/ResultTable';
import '../styles/QueryPage.css';

const QueryPage = () => {
  const [criteria, setCriteria] = useState({ 
    name: '',
    courseCategory: '',
    educationLevel: [],
  }); // State for search criteria
  const [results, setResults] = useState([]); // State to store search results
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState(null);

  // Handles the search request
  const handleSearch = useCallback(async () => {
    if (!criteria.name.trim() && !criteria.courseCategory && criteria.educationLevel.length === 0) {
      setResults([]); // Clear previous results if no criteria is entered
      return;
    }

    try {
      const searchResults = await searchData(criteria); // Call API with criteria
      setResults(searchResults); // Store the response data
      setNotification('Search completed successfully.');
      setNotificationType('success');
    } catch (error) {
      setNotification('Error during search.');
      setNotificationType('error');
    }
  }, [criteria]);

  // Handles the download request
  const handleDownload = () => {
    if (!results.queried_data || results.queried_data.length === 0) {
      setNotification('No data available to download.');
      setNotificationType('error');
      return;
    }

    // Extract educator's name and format a filename
    const name = results.educator_name;
    const fileName = `${name.replace(/\s+/g, '_')}_Qualifications_Worksheet.csv`;

    // Convert search results to CSV
    const csvHeaders = `"Faculty's Name","${name}"\n`; 
    const csvRows = results.queried_data.map(row => 
      Object.values(row).map(value => `"${value}"`).join(",") // Ensure CSV-safe formatting
    ).join("\n");

    const csvContent = csvHeaders + csvRows;

    // Create a Blob and download the CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Create and trigger a download link
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Free up memory

    setNotification('CSV downloaded successfully.');
    setNotificationType('success');
  };

  return (
    <div className="container">
      <h1>Query and Download Data</h1>
      {/* Notification Bar */}
      {notification && notificationType && (
        <NotificationBar message={notification} type={notificationType} />
      )}

      {/* Search Criteria Component */}
      <SearchCriteria 
        criteria={criteria} 
        setCriteria={setCriteria} 
        handleSearch={handleSearch} 
      />

      {/* Display ResultTable and export button only if results exist */}
      {results.queried_data && results.queried_data.length > 0 && (
        <>
          <ResultTable data={results} />
          <button className="export-btn" onClick={handleDownload}>
            Export as CSV
          </button>
        </>
      )}
    </div>
  );
}

export default QueryPage;
