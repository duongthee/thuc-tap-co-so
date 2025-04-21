import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(verifyToken); // Bảo vệ tất cả các route bên dưới bằng middleware xác thực token
router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
