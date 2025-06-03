import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from '../../pages/login/Login';
import JobAssign from '../../pages/job/assign-job/AssignJob';
import EmployeeList from '../../pages/employee/list-employee/ListEmployee';
import EmployeeInfor from '../../pages/employee/infor/Infor';
import PayrollList from '../../pages/payroll/list-payroll/ListPayroll';
import PayrollEmployee from '../../pages/payroll/employee-payroll/EmployeePayroll';
import { ProtectedRoute } from './ProtectedRoute';

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/employee/infor" /> : <Login />}
      />
      <Route 
        path="/job/assign" 
        element={<ProtectedRoute element={<JobAssign />} />}
      />
      <Route 
        path="/employee/list" 
        element={<ProtectedRoute element={<EmployeeList />} />}
      />
      <Route 
        path="/employee/infor" 
        element={<ProtectedRoute element={<EmployeeInfor />} />}
      />
      <Route 
        path="/payroll/list" 
        element={<ProtectedRoute element={<PayrollList />} />}
      />
      <Route 
        path="/payroll/employee" 
        element={<ProtectedRoute element={<PayrollEmployee />} />}
      />
      <Route 
        path="/payroll/employee/:employeeId" 
        element={<ProtectedRoute element={<PayrollEmployee />} />}
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
