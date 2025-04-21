import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.config.js';
import employeeRoutes from './routes/employee.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL, // Đảm bảo chỉ định frontend mà bạn muốn cho phép truy cập
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép headers cần thiết
  credentials: true, // Cho phép gửi cookie (credentials)
};
app.use(cookieParser()); // Giúp đọc cookie từ request
app.use(cors(corsOptions)); // Sử dụng cấu hình CORS
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);


// Connect to MongoDB and start server
const PORT = process.env.PORT || 8081;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
