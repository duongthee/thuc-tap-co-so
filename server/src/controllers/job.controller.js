import { createJob, getAllJob, getJobId, updateJob, deleteJob, getSalaryInJob, getSalaryByEmployeeId, getJobsByEmployeeId } from '../services/job.service.js';

export const createJobController = async (req, res) => {
    try {
        console.log('req.body:', req.body);
        const {
            dayStart,
            dayEnd,
            jobName,
            startTime,
            endTime,
            employees,
            place,
            status,
            note
        } = req.body;

        // Validate required fields
        if (!dayStart || !dayEnd || !jobName || !startTime || !endTime || !place || !note) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        // Validate employees array
        if (!Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng thêm ít nhất một nhân viên cho công việc'
            });
        }

        const newJob = await createJob(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo công việc thành công',
            data: newJob
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi tạo công việc'
        });
    }
}

export const getAllJobController = async (req, res) => {
    try {
        const jobs = await getAllJob();
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách công việc thành công',
            data: jobs
        });
    } catch (error) {
        console.error('Error getting jobs:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi lấy danh sách công việc'
        });
    }
}

export const getJobIdController = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await getJobId(jobId);
        res.status(200).json({
            success : true,
            message : 'Lấy công việc thành công',
            data : job
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const updateJobController = async (req, res) => {
    try {
        const { jobId } = req.params;
        const {
            day,
            jobName,
            startTime,
            endTime,
            employees : [
                {
                    employeeId,
                    salary
                }
            ],
            place,
            status,
            note
        } = req.body;
        const updatedJob = await updateJob(jobId, req.body);
        res.status(200).json({
            success : true,
            message : 'Cập nhật công việc thành công',
            data : updatedJob
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const deleteJobController = async (req, res) => {
    try {
        const {jobId} = req.params;
        await deleteJob(jobId);
        res.status(200).json({
            success : true,
            message : 'Xóa công việc thành công'
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const getSalaryController = async (req, res) => {
    try {
        const { month, year } = req.query;
        
        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp tháng và năm'
            });
        }

        const salaryData = await getSalaryInJob(parseInt(month), parseInt(year));
        
        res.status(200).json({
            success: true,
            message: 'Lấy thông tin lương thành công',
            data: salaryData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getSalaryByEmployeeIdController = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { month, year } = req.query;

        if (!employeeId || !month || !year) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp ID nhân viên, tháng và năm'
            });
        }

        const salaryData = await getSalaryByEmployeeId(employeeId, parseInt(month), parseInt(year));

        res.status(200).json({
            success: true,
            message: 'Lấy thông tin lương thành công',
            data: salaryData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getJobsByEmployeeIdController = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp ID nhân viên'
            });
        }

        const jobs = await getJobsByEmployeeId(employeeId);

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách công việc thành công',
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

