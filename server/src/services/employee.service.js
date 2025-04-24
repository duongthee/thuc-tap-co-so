import Employee from '../models/employee.model.js';

export const createEmployee = async (data) => {
  const newEmp = new Employee(data);
  return await newEmp.save();
};

export const getAllEmployees = async ({ page = 1, limit = 10, name = "", position = "", gender = "", sortBy = "name", sortOrder = "asc" }) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (name) {
    query.name = { $regex: name, $options: "i" };
  }
  if (position) {
    query.position = position;
  }
  if (gender) {
    query.gender = gender;
  }
  // Tùy chỉnh sắp xếp theo tên (tên cuối cùng, họ, tên đệm)
  const sort = {};
  if (sortBy === "name") {
    sort["name"] = sortOrder === "asc" ? 1 : -1;
  }

  const employees = await Employee.aggregate([
    { $match: query },
    {
      $addFields: {
        lastName: { $arrayElemAt: [{ $split: ["$name", " "] }, -1] }, // Tên cuối cùng
        firstName: { $arrayElemAt: [{ $split: ["$name", " "] }, 0] }, // Họ
        middleName: {
          $cond: {
            if: { $gt: [{ $size: { $split: ["$name", " "] } }, 2] },
            then: { $arrayElemAt: [{ $split: ["$name", " "] }, 1] }, // Tên đệm
            else: "",
          },
        },
      },
    },
    {
      $sort: {
        lastName: sortOrder === "asc" ? 1 : -1,
        firstName: sortOrder === "asc" ? 1 : -1,
        middleName: sortOrder === "asc" ? 1 : -1,
      },
    },
    { $skip: skip },
    { $limit: limitNum },
  ]);

  const totalRecords = await Employee.countDocuments(query);

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
