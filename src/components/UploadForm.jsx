import React, { useState } from 'react';
import './UploadForm.css';

function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file); 
      setFile(null);  
      e.target.reset(); 
    } else {
      alert('Please select a file to upload');
    }
  };

  return (
    <form onSubmit={handleUpload} className="upload-form">
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadForm;
