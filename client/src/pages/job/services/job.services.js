import apiClient from '../../../common/api/apiClient';

const API_URL = '/job';

// Lấy danh sách công việc
export const getJobs = async (page = 1, limit = 10, filters = {}, sortBy = "dayStart", sortOrder = "asc") => {
  try {
    const params = {
      page,
      limit,
      ...filters,
      sortBy,
      sortOrder
    };
    console.log('Sort params:', params); // Thêm log để debug
    const response = await apiClient.get(API_URL, { params });
    // Nếu response.data là mảng
    if (Array.isArray(response.data)) return response.data;
    // Nếu response.data.data là mảng
    if (Array.isArray(response.data.data)) return response.data.data;
    // Nếu response.data.data.data là mảng (trường hợp lồng nhiều lớp)
    if (response.data.data && Array.isArray(response.data.data.data)) return response.data.data.data;
    // Nếu không có dữ liệu hợp lệ, trả về mảng rỗng
    return [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách công việc');
  }
};

export const getJobById = async (id) => {
  try {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải thông tin công việc');
  }
};

export const addJob = async (jobData) => {
  try {
    const response = await apiClient.post(API_URL, jobData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể thêm công việc');
  }
};

export const updateJob = async (id, jobData) => {
  try {
    const response = await apiClient.put(`${API_URL}/${id}`, jobData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật công việc');
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa công việc');
  }
};

// Lấy danh sách nhân viên
export const getEmployees = async () => {
  try {
    const response = await apiClient.get('/employees');
    return response.data.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách nhân viên');
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await apiClient.post(API_URL, jobData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tạo công việc mới');
  }
};