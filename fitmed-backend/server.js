import dotenv from 'dotenv'; // Load environment variables
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';  // updated import style for mongoose
import morgan from 'morgan';
import helmet from 'helmet';

import authRoutes from './routes/auth.js';  // Auth Routes
import userRoutes from './routes/user.js';  // User Routes (including /fitness if any)
import dietRoutes from './routes/diet.js';
import fitnessRoutes from './routes/fitness.js';
import workoutRoutes from './routes/workout.js';

dotenv.config();  // Initialize dotenv

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON body
app.use(cors());
app.use(morgan('dev'));  // Logging
app.use(helmet());       // Security headers

// Routes
app.use('/api/diet', dietRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // includes other user-related routes

// Root route
app.get('/', (req, res) => {
  console.log('📢 Root route accessed');
  res.send('FitMed Guide Backend is Running');
});

// Test API
app.get('/test', (req, res) => {
  console.log('🛠 Test API accessed');
  res.json({ message: '✅ Test API is working fine!' });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled Error:', err.message);
  res.status(500).json({ error: '❌ Internal Server Error!' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitmedDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });
