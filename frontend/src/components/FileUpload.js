// src/components/FileUpload.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
function FileUpload({ onUploadSuccess, onUploadError }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { authTokens } = useContext(AuthContext);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      onUploadError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + String(authTokens?.access),
        },
      });
      onUploadSuccess(response.data);
    } catch (err) {
      onUploadError(err.response?.data?.error || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload & Analyze'}
      </button>
    </div>
  );
}

export default FileUpload;