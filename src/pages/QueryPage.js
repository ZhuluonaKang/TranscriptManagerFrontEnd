import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import NotificationBar from '../components/NotificationBar';
import TableComponent from '../components/TableComponent';
import SearchComponent from '../components/SearchComponent';
import { fetchExistingData, querySearchData } from '../api';
import '../styles.css';

const categoryList = [
    'Accounting', 'Communication', 'Curriculum', 'Dissertation', 'eBiz', 'Economics', 
    'Educ Subjects', 'Education Leadership', 'Entrepreneurship', 'Ethics/Soc Resp', 
    'Finance', 'Hardware', 'HR/ORG/Leader', 'International Business', 'IT General', 
    'Law', 'Legal', 'Management', 'Marketing', 'Networking', 'Operations Mgmt', 
    'Other Business', 'Other Education', 'Other Education Leadership', 'Other IT', 
    'Programming', 'Project Mgmt', 'Psychology', 'Research/Stats', 'Security', 
    'Strategy', 'Telecomm', 'TESOL/ESL/TFL'
];

const educationLevels = ['Bachelor', 'Master', 'Doctorate'];

const ExportButtons = React.memo(({ data }) => {
    const headers = useMemo(() => [
        { label: 'Educator', key: 'educatorname' },
        { label: 'Course Name', key: 'course_name' },
        { label: 'Credits Earned', key: 'credits_earned' },
        { label: 'Grade', key: 'grade' },
        { label: 'Category', key: 'should_be_category' }
    ], []);

    const exportToExcel = useCallback(() => {
        if (!data || data.length === 0) return;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transcripts');
        XLSX.writeFile(workbook, 'exported_data.xlsx');
    }, [data]);

    if (!data || data.length === 0) return null;

    return (
        <div className="export-container">
            <CSVLink data={data} headers={headers} filename="exported_data.csv" className="export-btn">
                Export as CSV
            </CSVLink>
            <button className="export-btn" onClick={exportToExcel}>Export as Excel</button>
        </div>
    );
});

const QueryPage = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedEducation, setSelectedEducation] = useState([]);
    const [notification, setNotification] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        fetchExistingData()
            .then(result => {
                setData(result);
                setNotification('Data loaded successfully.');
                setNotificationType('success');
            })
            .catch(() => {
                setNotification('Error loading data.');
                setNotificationType('error');
            });
    }, []);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim() && !selectedCategory && selectedEducation.length === 0) {
            setData([]);
            setSearched(false);
            return;
        }
        try {
            const searchParams = { query: searchQuery, category: selectedCategory, education: selectedEducation };
            const filteredData = await querySearchData(searchParams);
            setData(filteredData);
            setNotification('Search completed successfully.');
            setNotificationType('success');
            setSearched(true);
        } catch (error) {
            setNotification('Error during search.');
            setNotificationType('error');
        }
    }, [searchQuery, selectedCategory, selectedEducation]);

    return (
        <div className="container query-page">
            <h1>Query and Download</h1>
            <NotificationBar message={notification} type={notificationType} />
            <SearchComponent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedEducation={selectedEducation}
                setSelectedEducation={setSelectedEducation}
                handleSearch={handleSearch}
                categoryList={categoryList}
                educationLevels={educationLevels}
            />
            {searched && data.length > 0 && (
                <>
                    <TableComponent data={data} />
                    <ExportButtons data={data} />
                </>
            )}
        </div>
    );
};

export default QueryPage;











