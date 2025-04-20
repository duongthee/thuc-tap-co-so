import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from '../../pages/login/Login';
import Dashboard from '../../pages/dashboard/Dashboard';
import ScheduleAssign from '../../pages/schedule/assign-schedule/AssignSchedule';
import ScheduleSet from '../../pages/schedule/set-schedule/SetSchedule';
import EmployeeList from '../../pages/employee/list-employee/ListEmployee';
import EmployeeInfor from '../../pages/employee/infor/Infor';
import PayrollList from '../../pages/payroll/list-payroll/ListPayroll';
import PayrollEmployee from '../../pages/payroll/employee-payroll/EmployeePayroll';
import MainLayout from '../components/MainLayout';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <MainLayout>{element}</MainLayout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      <Route path="/schedule/assign" element={<PrivateRoute element={<ScheduleAssign />} />} />
      <Route path="/schedule/set" element={<PrivateRoute element={<ScheduleSet />} />} />
      <Route path="/employee/list" element={<PrivateRoute element={<EmployeeList />} />} />
      <Route path="/employee/infor" element={<PrivateRoute element={<EmployeeInfor />} />} />
      <Route path="/payroll/list" element={<PrivateRoute element={<PayrollList />} />} />
      <Route path="/payroll/employee" element={<PrivateRoute element={<PayrollEmployee />} />} />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
