export const mockData = [
    { educatorname: 'Dr. Smith', course_name: 'Leadership Theory', credits_earned: 3, grade: 'B+', should_be_category: 'Management', education_level: 'Doctorate' },
    { educatorname: 'Dr. Smith', course_name: 'Program Evaluation', credits_earned: 3, grade: 'B', should_be_category: 'Research/Stats', education_level: 'Doctorate' },
    { educatorname: 'Dr. Johnson', course_name: 'Finance Principles', credits_earned: 4, grade: 'A', should_be_category: 'Finance', education_level: 'Master' },
    { educatorname: 'Dr. Johnson', course_name: 'Advanced Accounting', credits_earned: 3, grade: 'A-', should_be_category: 'Accounting', education_level: 'Master' },
    { educatorname: 'Prof. Miller', course_name: 'Marketing Strategies', credits_earned: 3, grade: 'A-', should_be_category: 'Marketing', education_level: 'Bachelor' },
];

// **修复 fetchExistingData**
export const fetchExistingData = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData);
        }, 500);
    });
};

// **修复 querySearchData**
export const querySearchData = async ({ query, category, education }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredData = mockData.filter((item) => {
                const matchesQuery = query ? 
                    Object.values(item).some(value => 
                        value.toString().toLowerCase().includes(query.toLowerCase())
                    ) : true;

                const matchesCategory = category ? item.should_be_category === category : true;

                const matchesEducation = education.length > 0 ? education.includes(item.education_level) : true;

                return matchesQuery && matchesCategory && matchesEducation;
            });
            resolve(filteredData);
        }, 300);
    });
};


