import React from 'react';

function SearchComponent({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedEducation, setSelectedEducation, handleSearch, categoryList, educationLevels }) {
    const handleEducationChange = (level) => {
        if (selectedEducation.includes(level)) {
            setSelectedEducation(selectedEducation.filter(item => item !== level));
        } else {
            setSelectedEducation([...selectedEducation, level]);
        }
    };

    return (
        <div className="search-container">
            {/* 搜索框 + 下拉菜单 + 搜索按钮（水平排列） */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="dropdown-select"
                >
                    <option value="">Select Category</option>
                    {categoryList.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <button className="search-btn" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {/* CheckBox 组（放在搜索框下面，水平排列） */}
            <div className="checkbox-container">
                <label className="checkbox-title">Education Level:</label>
                <div className="checkbox-group">
                    {educationLevels.map((level, index) => (
                        <label key={index} className="checkbox-label">
                            <input
                                type="checkbox"
                                value={level}
                                checked={selectedEducation.includes(level)}
                                onChange={() => handleEducationChange(level)}
                            />
                            {level}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchComponent;





