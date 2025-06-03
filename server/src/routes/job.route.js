import express from 'express';
import {
    createJobController,
    getAllJobController,
    getSalaryController,
    getSalaryByEmployeeIdController,
    deleteJobController,
    getJobIdController,
    updateJobController,
    getJobsByEmployeeIdController
} from '../controllers/job.controller.js';
import { verifyToken, checkStaffPermission } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(checkStaffPermission);

router.post('/', createJobController);

router.get('/', getAllJobController);

router.get('/salary', getSalaryController);

router.get('/salary/employee/:employeeId', getSalaryByEmployeeIdController);

router.get('/employee/:employeeId', getJobsByEmployeeIdController);

router.get('/:jobId', getJobIdController);

router.put('/:jobId', updateJobController);

router.delete('/:jobId', deleteJobController);


export default router;

