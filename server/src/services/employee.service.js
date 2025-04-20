import Employee from '../models/employee.model.js';

export const createEmployee = async (data) => {
  const newEmp = new Employee(data);
  return await newEmp.save();
};

export const getAllEmployees = async () => {
  return await Employee.find();
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
