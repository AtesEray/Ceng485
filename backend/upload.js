const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Enable CORS for frontend requests
app.use(cors());

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify upload directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}${path.extname(file.originalname)}`);  // Set unique file name
  },
});

const upload = multer({ storage });

// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.status(200).json({ file: req.file.filename });
});

// Route to list files
app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Error reading files');
    }
    res.status(200).json(files);  // Send the list of files in the 'uploads' folder
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
