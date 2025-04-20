import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../pages/login/Login';
import HomePage from '../../pages/home/HomePage';
import MainLayout from '../components/MainLayout';
import { useSelector } from 'react-redux';

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      <Route path="/home" element={
        isAuthenticated ? (
          <MainLayout>
            <HomePage />
          </MainLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;