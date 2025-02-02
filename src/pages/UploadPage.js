import React, { useState } from 'react';
import '../styles.css';

function UploadPage() {
    const [uploadedFiles, setUploadedFiles] = useState([]); // 追踪文件列表
    const [uploadStatus, setUploadStatus] = useState(''); // 总体上传状态
    const [progress, setProgress] = useState({}); // 每个文件的上传进度
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const maxFileCount = 100;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/csv']; // 允许的文件格式

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > maxFileCount) {
            setUploadStatus(`Error: You can upload up to ${maxFileCount} files at a time.`);
            return;
        }

        const invalidFiles = files.filter(
            (file) => !allowedTypes.includes(file.type) || file.size > maxFileSize
        );

        if (invalidFiles.length > 0) {
            const errors = invalidFiles.map((file) => {
                if (!allowedTypes.includes(file.type)) {
                    return `${file.name} has an unsupported format.`;
                }
                if (file.size > maxFileSize) {
                    return `${file.name} exceeds the maximum size of 5MB.`;
                }
                return null;
            });
            setUploadStatus(`Error:\n${errors.join('\n')}`);
            return;
        }

        setUploadedFiles(files);
        setUploadStatus('Uploading...');

        // 初始化进度条
        const progressMap = {};
        files.forEach(file => progressMap[file.name] = 0);
        setProgress(progressMap);

        // 模拟上传过程（如果有后端 API，可以用 axios/fetch）
        files.forEach((file, index) => {
            simulateUpload(file);
        });
    };

    const simulateUpload = (file) => {
        const totalSteps = 10;
        let step = 0;
        const interval = setInterval(() => {
            step += 1;
            setProgress(prevProgress => ({
                ...prevProgress,
                [file.name]: (step / totalSteps) * 100 // 更新进度条
            }));

            if (step === totalSteps) {
                clearInterval(interval);
                setUploadStatus('Upload complete!');
            }
        }, 300); // 进度每 300ms 增加一次
    };

    return (
        <div className="container">
            <h1>Upload Transcripts</h1>
            <p>Allowed formats: <strong>PDF, JPG, PNG, CSV</strong> | Maximum size: <strong>5MB</strong> | Max files: <strong>100</strong></p>
            <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png, .csv"
                multiple
                onChange={handleFileUpload}
            />
            {uploadStatus && (
                <p className={uploadStatus.startsWith('Error') ? 'error-text' : 'success-text'}>
                    {uploadStatus}
                </p>
            )}
            {uploadedFiles.length > 0 && (
                <div>
                    <h3>Uploading Files:</h3>
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>
                                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${progress[file.name] || 0}%` }}
                                    >
                                        {Math.round(progress[file.name] || 0)}%
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default UploadPage;







