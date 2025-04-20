import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Employee from '../models/employee.model.js';  // Import Employee Model

export const authenticateUser = async ({ email, password }) => {
  // 1. Tìm user qua email
  const user = await User.findOne({ email }).populate('employeeId'); // Dùng populate để lấy dữ liệu Employee nếu cần
  if (!user) {
    const err = new Error('Email không tồn tại');
    err.status = 401;
    throw err;
  }

  // 2. So sánh mật khẩu
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Sai mật khẩu');
    err.status = 401;
    throw err;
  }

  // 3. Tạo payload cho token
  const payload = {
    sub: user._id,
    role: user.role
  };

  // 4. Tạo JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

  // 5. Trả về user (có thể omit password) và token
  const { password: _, ...userData } = user.toObject();
  return { user: userData, token };
};

export const registerUser = async ({ email, password, role, employeeId }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('Email đã tồn tại');
    err.status = 400;
    throw err;
  }

  // Kiểm tra employeeId có hợp lệ không
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    const err = new Error('Employee không tồn tại');
    err.status = 400;
    throw err;
  }

  const newUser = new User({
    email,
    password,
    role,
    employeeId
  });

  await newUser.save();
  return newUser;
};