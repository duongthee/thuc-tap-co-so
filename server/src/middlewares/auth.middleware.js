import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // hoặc req.cookies.accessToken tùy bạn đặt tên

  if (!token) {
    return res.status(401).json({ message: 'Access token not found in cookies' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gắn info user vào request để dùng tiếp
    next(); // Cho phép đi tiếp
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};