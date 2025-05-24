import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import './Dashboard.css';

function Dashboard() {
  const [documents, setDocuments] = useState([]);

  const handleUpload = (file) => {
    const newDoc = {
      id: Date.now(),
      name: file.name,
      file: file,
    };
    setDocuments(prevDocs => [...prevDocs, newDoc]);
  };

  const handleDelete = (id) => {
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <h2>📁 Your Document Portal</h2>
        <UploadForm onUpload={handleUpload} />
        <div className="doc-list">
          {documents.length === 0 ? (
            <p className="empty">No documents uploaded yet.</p>
          ) : (
            <ul>
              {documents.map((doc) => (
                <li key={doc.id}>
                  <span>📄 {doc.name}</span>
                  <button onClick={() => handleDelete(doc.id)}>🗑️</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
