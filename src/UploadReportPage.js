import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadReport() {
  const [file, setFile] = useState(null);  // Store the selected file
  const [fileList, setFileList] = useState([]);  // Store the list of uploaded files
  const [loading, setLoading] = useState(false);  // Handle loading state
  const navigate = useNavigate();

  // Fetch the list of files when the component loads
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:5000/files");
        if (response.ok) {
          const data = await response.json();
          setFileList(data);  // Update the file list state
        } else {
          console.error('Failed to fetch files');
          alert('Failed to fetch files');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        alert('An error occurred while fetching files');
      }
    };

    fetchFiles();  // Fetch files on mount
  }, []);  // Empty dependency array ensures it runs only once on component mount

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);  // Append the selected file to the form data

    try {
      setLoading(true);  // Show loading state

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newFile = await response.json();  // Get the file name from the response
        setFileList((prevList) => [...prevList, newFile.fileName]);  // Update the file list
        alert("File uploaded successfully!");
      } else {
        const errorMessage = await response.text();
        alert(`Failed to upload file: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during upload.");
    } finally {
      setLoading(false);  // Hide loading state
    }
  };

  return (
    <div className="container">
      <h2 className="title">Upload Report Page</h2>
      <p className="description">Here you can upload an auto expert report</p>

      <div className="Upload-section">
        <input
          type="file"
          className="file-input"
          onChange={handleFileChange}  // Handle file selection
        />
        <button
          className="button"
          onClick={handleUpload}  // Trigger the upload function
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <h3>Uploaded Files:</h3>
      <ul>
        {fileList.length > 0 ? (
          fileList.map((filename, index) => (
            <li key={index}>{filename}</li>  // List each uploaded file
          ))
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </ul>

      <button
        className="button secondary"
        onClick={() => navigate('/')}
        style={{ marginTop: '20px' }}
      >
        Go To Home Page
      </button>
    </div>
  );
}

export default UploadReport;
