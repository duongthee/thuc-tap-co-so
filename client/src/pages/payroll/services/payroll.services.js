import apiClient from '../../../common/api/apiClient';

const API_URL = 'http://localhost:8080/api';

// Lấy token từ Redux store
const getToken = () => {
    const state = JSON.parse(localStorage.getItem('persist:auth'));
    if (state && state.token) {
        return JSON.parse(state.token);
    }
    return null;
};

// Lấy tổng lương theo tháng
export const getTotalSalaryByMonth = async (month, year) => {
    try {
        const response = await apiClient.get(`/job/salary`, {
            params: { month, year }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu lương';
    }
};

// Lấy lương theo nhân viên
export const getSalaryByEmployee = async (employeeId, month, year) => {
    try {
        const response = await apiClient.get(`/job/salary/employee/${employeeId}`, {
            params: { month, year }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu lương';
    }
};

// Lấy danh sách công việc của nhân viên
export const getJobsByEmployee = async (employeeId) => {
    try {
        const response = await apiClient.get(`/job/employee/${employeeId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách công việc';
    }
};

// Lấy danh sách nhân viên
export const getEmployees = async () => {
    try {
        const response = await apiClient.get('/employees');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách nhân viên';
    }
};
