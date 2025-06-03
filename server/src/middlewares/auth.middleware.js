import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const checkStaffPermission = (req, res, next) => {
  if (req.user.role === 'Staff') {
    // Chặn truy cập vào các route không được phép
    const blockedRoutes = [
      '/api/jobs',           // Chặn xem công việc
      '/api/employees',      // Chặn xem danh sách nhân viên
      '/api/jobs/salary'     // Chặn xem thống kê lương
    ];

    const currentPath = req.path;
    if (blockedRoutes.some(route => currentPath.startsWith(route))) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập vào tài nguyên này' });
    }

    // Chỉ cho phép xem bảng lương của chính mình
    if (currentPath.startsWith('/api/jobs/salary/employee/')) {
      const requestedEmployeeId = currentPath.split('/').pop();
      if (requestedEmployeeId !== req.user.employeeId.toString()) {
        return res.status(403).json({ message: 'Bạn chỉ có thể xem bảng lương của chính mình' });
      }
    }
  }
  next();
};