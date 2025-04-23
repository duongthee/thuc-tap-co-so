import apiClient from '../../../../common/api/apiClient'; // Import apiClient thay vì axios

const API_URL = '/employees'; // Chỉ cần endpoint, vì baseURL đã được cấu hình trong apiClient

export const getEmployee = async (page, limit, filter, sortBy = "name" , sortOrder = "asc") => {
  try {
    const response = await apiClient.get(API_URL, {
      params: {
        page,
        limit,
        name: filter.name || "",
        gender: filter.gender || "",
        position: filter.position || "",
        sortBy,
        sortOrder,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi không xác định!');
  }
};