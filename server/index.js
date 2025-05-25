import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

// Initialize Gemini API with the API key
const genAI = new GoogleGenerativeAI('AIzaSyCc-EJ5Zpk5eLkY__0sRDzzTY7Pcz7Kod0');

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ 
      message: 'File uploaded successfully',
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Ask AI endpoint
app.post('/api/ask-ai', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    console.log('Received question:', question);

    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content
    const result = await model.generateContent(question);
    const response = await result.response;
    const text = response.text();

    console.log('AI Response:', text);

    res.json({ response: text });
  } catch (error) {
    console.error('AI response error:', error);
    res.status(500).json({ 
      message: 'Error getting AI response',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Uploads directory:', uploadsDir);
}); 