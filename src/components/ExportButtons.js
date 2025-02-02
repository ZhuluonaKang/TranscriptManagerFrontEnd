import React, { useCallback, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';

const ExportButtons = ({ data }) => {
    // Ensure Hooks are always called
    const hasData = data && data.length > 0;
    
    const headers = useMemo(() => [
        { label: 'Educator', key: 'educatorname' },
        { label: 'Course Name', key: 'course_name' },
        { label: 'Credits Earned', key: 'credits_earned' },
        { label: 'Grade', key: 'grade' },
        { label: 'Category', key: 'should_be_category' }
    ], []);

    const exportToExcel = useCallback(() => {
        if (!hasData) return;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transcripts');
        XLSX.writeFile(workbook, 'exported_data.xlsx');
    }, [data, hasData]);

    if (!hasData) return <p>No data available to export.</p>;

    return (
        <div className="export-container">
            <CSVLink data={data} headers={headers} filename="exported_data.csv" className="export-btn">
                Export as CSV
            </CSVLink>
            <button className="export-btn" onClick={exportToExcel}>Export as Excel</button>
        </div>
    );
};

export default React.memo(ExportButtons);






