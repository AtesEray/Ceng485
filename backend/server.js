require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Route'lar
app.use('/api/auth', authRoutes);

// Server Başlat
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


//////////////////////// I P F S ////////////////////////////////
const express = require('express');
const { uploadToIPFS } = require('./services/ipfsService');

const app = express();
app.use(express.json());

app.post('/upload', async (req, res) => {
  const { data } = req.body; // Veriyi alın
  try {
    const ipfsHash = await uploadToIPFS(data);
    res.json({ success: true, ipfsHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));

