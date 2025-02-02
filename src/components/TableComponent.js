import React from 'react';

const TableComponent = ({ data }) => {
    // 统计 `should_be_category` 下的课程数量
    const categoryCounts = data.reduce((acc, row) => {
        acc[row.should_be_category] = (acc[row.should_be_category] || 0) + 1;
        return acc;
    }, {});

    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Educator</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits Earned</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Grade</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '8px' }}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.educatorname}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.course_name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.credits_earned}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.grade}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.should_be_category}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* 统计 `should_be_category` 课程总数 */}
            <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                <h3>Category Counts:</h3>
                <ul>
                    {Object.entries(categoryCounts).map(([category, count]) => (
                        <li key={category}>{category}: {count}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TableComponent;





