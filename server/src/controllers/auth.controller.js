import { authenticateUser } from '../services/auth.service.js';
import { registerUser } from '../services/auth.service.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authenticateUser({ email, password });

    // Gửi cookie HttpOnly chứa token
    res.cookie(process.env.COOKIE_NAME || 'token', token, {
      httpOnly: true,
      maxAge: parseInt(process.env.COOKIE_EXPIRES, 10) || 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({
      message: 'Đăng nhập thành công',
      user,
      token
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Đã xảy ra lỗi trong quá trình đăng nhập'
    });
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'token');
  res.json({ message: 'Đã đăng xuất' });
};


export const register = async (req, res, next) => {
  try {
    const { email, password, role, employeeId } = req.body;

    const newUser = await registerUser({ email, password, role, employeeId });

    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({
      message: 'Tạo người dùng thành công',
      user: userData
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Đã xảy ra lỗi trong quá trình tạo người dùng'
    });
    next(err);
  }
};