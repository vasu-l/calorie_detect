const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); // Add this line

dotenv.config(); // Load environment variables from .env file

const authRoutes = require('./routes/authRoutes.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: ["http://localhost:5173", "https://app.mmrtechsolutions.co.in"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Ensure MONGO_URI is loaded correctly
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);

const PORT = process.env.PORT || 5900;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
