import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.config.js';
import employeeRoutes from './routes/employee.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import jobRoutes from './routes/job.route.js';
dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : true, // Cho phép tất cả origin trong development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['set-cookie']
};
app.use(cookieParser()); // Giúp đọc cookie từ request
app.use(cors(corsOptions)); // Sử dụng cấu hình CORS
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/job', jobRoutes);
// Connect to MongoDB and start server
const PORT = process.env.PORT || 8081;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
