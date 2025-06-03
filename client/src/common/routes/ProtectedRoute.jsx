import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

export const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  // Nếu chưa đăng nhập, chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra quyền cho Staff
  if (user?.role === 'Staff') {
    const restrictedRoutes = [
      '/employee/list',        // Chặn xem danh sách nhân viên
      '/payroll/list'          // Chặn xem thống kê lương
    ];

    const currentPath = window.location.pathname;
    if (restrictedRoutes.includes(currentPath)) {
      return <Navigate to="/employee/infor" />;
    }
  }

  return <MainLayout>{element}</MainLayout>;
};