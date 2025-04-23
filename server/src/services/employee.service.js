import Employee from '../models/employee.model.js';

export const createEmployee = async (data) => {
  const newEmp = new Employee(data);
  return await newEmp.save();
};

export const getAllEmployees = async ({ page = 1, limit = 10, name ="", position="", gender="" , sortBy = "name", sortOrder = "asc" }) => {
  // Chuyển đổi page và limit thành số
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  // Tạo query object để lọc
  const query = {};
  // Lọc theo tên (không phân biệt hoa thường)
  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }
  // Lọc theo chức vụ
  if (position) {
    query.position = position;
  }
  // Lọc theo giới tính
  if (gender) {
    query.gender = gender;
  }
  const sort = {[sortBy]: sortOrder === 'asc' ?1 : -1}; // Thay đổi sortBy và sortOrder theo yêu cầu của bạn
  const totalRecords = await Employee.countDocuments(query);
  const employees = await Employee.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .lean(); 
  return {
    employees,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limitNum),
    currentPage: pageNum,
    limit: limitNum,
  };
};

export const getEmployeeById = async (id) => {
  return await Employee.findById(id);
};

export const updateEmployee = async (id, data) => {
  return await Employee.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEmployee = async (id) => {
  return await Employee.findByIdAndDelete(id);
};
