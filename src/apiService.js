import axios from 'axios';

// 设置 API 基础 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * 上传文件到后端
 * @param {File} file - 要上传的文件
 * @returns {Promise<Object>} - 后端处理后的文件数据
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * 在后端进行数据搜索
 * @param {Object} criteria - 搜索条件
 * @returns {Promise<Array>} - 搜索结果
 */
export const searchData = async (criteria) => {
  try {
    const response = await axios.post(`${API_URL}/search`, criteria);
    return response.data;
  } catch (error) {
    console.error('Error searching data:', error);
    throw error;
  }
};

/**
 * 下载数据并保存为 CSV 文件
 * @returns {Promise<void>} - 触发文件下载
 */
export const downloadData = async () => {
  try {
    const response = await axios.get(`${API_URL}/download`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading data:', error);
    throw error;
  }
};
