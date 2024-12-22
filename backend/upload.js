const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');  // To read files from the uploads folder

const router = express.Router();  // Create a router

// File storage setup for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify the upload folder
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// POST route for file upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({ fileName: req.file.filename });  // Send back the filename
});

// GET route to list files in the uploads folder
router.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading files' });
    }
    res.status(200).json(files);  // Return the list of file names
  });
});

module.exports = router;  // Export the router
