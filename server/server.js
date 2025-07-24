require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const connectDB = require('./config/db');
const doctorRoutes = require('./routes/doctors');
const ApiError = require('./utils/apiError');
const logger = require('./utils/logger');

const app = express();

// 1. Database connection
connectDB();

// 2. Security Middleware Stack
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// 4. CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev
    'http://localhost:3000', // CRA dev
    'https://doctor-patient-finder.vercel.app', // Production
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests

// 5. Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ✅ 6. Root Route for Render (required for status check)
app.get('/', (req, res) => {
  res.send('Doctor-Patient Finder API is running ✅');
});

// 7. API Routes
app.use('/api/doctors', doctorRoutes);

// 8. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// 9. Static File Serving (e.g. for uploads)
app.use('/uploads', express.static('uploads'));

// 10. 404 Handler
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// 11. Global Error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl}`);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 12. Server Startup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// 13. Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION: ${err.name} - ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
