import Job from '../models/job.model.js';

export const createJob = async (jobData) => {
    try {
        const newJob = await Job.create(jobData);
        return newJob;
    } catch (error) {
        throw new Error('Lỗi khi tạo công việc: ' + error.message);
    }
}

export const getAllJob = async () => {
    const jobs = await Job.find().populate({
        path : 'employees.employeeId',
        select : 'name phone position'
    });
    if(!jobs) {
        throw new Error('Không tìm thấy công việc');
    }
    return jobs;
}

export const getJobId = async (jobId) => {
    const job = await Job.findById(jobId).populate({
        path : 'employees.employeeId',
        select : 'name phone position'
    });
    if(!job) {
        throw new Error('Không tìm thấy công việc');
    }
    return job;
}

export const updateJob = async (jobId, jobData) => {
    const job = await Job.findByIdAndUpdate(jobId, jobData, {new : true});
    if(!job) {
        throw new Error('Không tìm thấy công việc');
    }
    return job;
}

export const deleteJob = async (jobId) => {
    const job = await Job.findByIdAndDelete(jobId);
    if(!job) {
        throw new Error('Không tìm thấy công việc');
    }
}

export const getSalaryInJob = async (month, year) => {
    try {
        // Tạo ngày đầu và cuối của tháng
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Tìm tất cả job trong khoảng thời gian
        const jobs = await Job.find({
            dayStart: {
                $gte: startDate,
                $lte: endDate
            },
            status: 'Đã hoàn thành' // Chỉ tính lương cho các job đã hoàn thành
        }).populate('employees.employeeId', 'name position');

        // Tính tổng lương cho từng nhân viên
        const salaryByEmployee = {};

        jobs.forEach(job => {
            job.employees.forEach(employee => {
                const employeeId = employee.employeeId._id.toString();
                if (!salaryByEmployee[employeeId]) {
                    salaryByEmployee[employeeId] = {
                        employeeId: employee.employeeId._id,
                        name: employee.employeeId.name,
                        position: employee.employeeId.position,
                        totalSalary: 0,
                        jobs: []
                    };
                }
                salaryByEmployee[employeeId].totalSalary += employee.salary;
                salaryByEmployee[employeeId].jobs.push({
                    jobName: job.jobName,
                    day: job.dayStart ? job.dayStart.toISOString() : '',
                    salary: employee.salary
                });
            });
        });

        // Chuyển đổi object thành array và sắp xếp theo tổng lương giảm dần
        const result = Object.values(salaryByEmployee).sort((a, b) => b.totalSalary - a.totalSalary);

        return {
            month,
            year,
            totalEmployees: result.length,
            employees: result
        };
    } catch (error) {
        throw new Error('Lỗi khi tính lương: ' + error.message);
    }
}

export const getSalaryByEmployeeId = async (employeeId, month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        // Tìm tất cả job trong khoảng thời gian có nhân viên này tham gia
        const jobs = await Job.find({
            dayStart: {
                $gte: startDate,
                $lt: endDate // dùng $lt để lấy hết ngày cuối cùng của tháng
            },
            'employees.employeeId': employeeId,
            status: 'Đã hoàn thành'
        }).populate({
            path: 'employees.employeeId',
            select: 'name position'
        });

        // Lọc và tính lương cho nhân viên cụ thể
        const employeeJobs = [];
        let totalSalary = 0;
        let employeeInfo = null;

        jobs.forEach(job => {
            // Lọc ra employee data cho nhân viên cụ thể
            const employeeData = job.employees.find(emp => {
                if (!emp.employeeId) return false;
                // Nếu đã populate thì emp.employeeId là object, nếu chưa thì là string
                if (typeof emp.employeeId === 'object' && emp.employeeId._id) {
                    return emp.employeeId._id.toString() === employeeId;
                }
                return emp.employeeId.toString() === employeeId;
            });

            if (employeeData && employeeData.employeeId) {
                employeeJobs.push({
                    jobName: job.jobName,
                    day: job.dayStart ? job.dayStart.toISOString() : '',
                    salary: employeeData.salary,
                    place: job.place,
                    startTime: job.startTime,
                    endTime: job.endTime
                });
                totalSalary += employeeData.salary;
                // Lưu thông tin nhân viên từ job đầu tiên tìm thấy
                if (!employeeInfo && typeof employeeData.employeeId === 'object') {
                    employeeInfo = employeeData.employeeId;
                }
            }
        });

        if (jobs.length === 0) {
            return {
                month,
                year,
                employee: null,
                totalSalary: 0,
                jobs: [],
                message: 'Không tìm thấy công việc nào trong tháng này'
            };
        }

        if (!employeeInfo) {
            return {
                month,
                year,
                employee: null,
                totalSalary: 0,
                jobs: [],
                message: 'Không tìm thấy thông tin nhân viên trong các công việc'
            };
        }

        return {
            month,
            year,
            employee: {
                id: employeeInfo._id,
                name: employeeInfo.name,
                position: employeeInfo.position
            },
            totalSalary,
            jobs: employeeJobs,
            message: 'Lấy thông tin lương thành công'
        };
    } catch (error) {
        throw new Error('Lỗi khi lấy thông tin lương: ' + error.message);
    }
}

export const getJobsByEmployeeId = async (employeeId) => {
    try {
        const jobs = await Job.find({
            'employees.employeeId': employeeId,
            status: 'Đã hoàn thành'
        }).populate({
            path: 'employees.employeeId',
            select: 'name position'
        }).sort({ dayStart: -1 }); // Sắp xếp theo ngày giảm dần

        // Lọc và format dữ liệu cho nhân viên cụ thể
        const employeeJobs = jobs.map(job => {
            const employeeData = job.employees.find(emp => {
                if (!emp.employeeId) return false;
                if (typeof emp.employeeId === 'object' && emp.employeeId._id) {
                    return emp.employeeId._id.toString() === employeeId;
                }
                return emp.employeeId.toString() === employeeId;
            });

            return {
                jobId: job._id,
                jobName: job.jobName,
                day: job.dayStart,
                startTime: job.startTime,
                endTime: job.endTime,
                place: job.place,
                salary: employeeData ? employeeData.salary : 0,
                status: job.status
            };
        });

        return employeeJobs;
    } catch (error) {
        throw new Error('Lỗi khi lấy danh sách công việc: ' + error.message);
    }
};