require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const doctorRoutes = require('./routes/doctors');

const app = express();

// Database
connectDB();

// CORS
const allowedOrigins = [
  'https://doctor-patient-finder.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Parser
app.use(express.json());

// Routes
app.use('/api/doctors/', doctorRoutes);

// Errors
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    data: null
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
