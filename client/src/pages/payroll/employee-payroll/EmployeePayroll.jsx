import React, { useState, useEffect } from 'react';
import { getSalaryByEmployee, getEmployees } from '../services/payroll.services';
import { Card, Select, Table, message, Tag } from 'antd';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Option } = Select;

const EmployeePayroll = () => {
    const { employeeId: paramEmployeeId } = useParams();
    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [salaryData, setSalaryData] = useState(null);
    const [month, setMonth] = useState(dayjs().month() + 1);
    const [year, setYear] = useState(dayjs().year());
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const response = await getEmployees();
            if (response.data) {
                setEmployees(response.data);
            } else {
                message.error('Có lỗi xảy ra khi lấy danh sách nhân viên');
            }
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra khi lấy danh sách nhân viên');
        } finally {
            setLoadingEmployees(false);
        }
    };

    useEffect(() => {
        // Nếu là Staff, chỉ lấy thông tin của chính mình
        if (user?.role === 'Staff') {
            setSelectedEmployee(user.employeeId._id);
        } else {
            fetchEmployees();
        }
    }, [user]);

    useEffect(() => {
        // Nếu có employeeId từ URL params, sử dụng nó
        if (paramEmployeeId) {
            setSelectedEmployee(paramEmployeeId);
        }
    }, [paramEmployeeId]);

    const fetchSalaryData = async () => {
        if (!selectedEmployee) return;
        
        try {
            setLoading(true);
            const response = await getSalaryByEmployee(selectedEmployee, month, year);
            if (response.success) {
                setSalaryData(response.data);
            } else {
                message.error(response.message || 'Có lỗi xảy ra khi lấy dữ liệu lương');
            }
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu lương');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedEmployee) {
            fetchSalaryData();
        }
    }, [selectedEmployee, month, year]);

    const getPositionColor = (position) => {
        switch (position) {
            case "Admin":
                return "red";
            case "Photographer":
                return "orange";
            case "CamOp":
                return "green";
            default:
                return "gray";
        }
    };

    const columns = [
        {
            title: 'Tên công việc',
            dataIndex: 'jobName',
            key: 'jobName',
        },
        {
            title: 'Ngày thực hiện',
            dataIndex: 'day',
            key: 'day',
            render: (day) => dayjs(day).format('DD/MM/YYYY'),
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_, record) => `${record.startTime} - ${record.endTime}`,
        },
        {
            title: 'Địa điểm',
            dataIndex: 'place',
            key: 'place',
        },
        {
            title: 'Lương',
            dataIndex: 'salary',
            key: 'salary',
            render: (salary) => `${salary.toLocaleString('vi-VN')} VNĐ`,
        },
    ];

    const handleEmployeeChange = (value) => {
        setSelectedEmployee(value);
    };

    const handleMonthChange = (value) => {
        setMonth(value);
    };

    const handleYearChange = (value) => {
        setYear(value);
    };

    return (
        <div className="p-6">
            <Card title="Báo cáo lương nhân viên" className="mb-4">
                <div className="flex gap-4 mb-6">
                    {user?.role !== 'Staff' && (
                        <Select
                            placeholder="Chọn nhân viên"
                            style={{ width: 200 }}
                            onChange={handleEmployeeChange}
                            value={selectedEmployee}
                            loading={loadingEmployees}
                        >
                            {employees.map(employee => (
                                <Option key={employee._id} value={employee._id}>
                                    {employee.name} - {employee.position}
                                </Option>
                            ))}
                        </Select>
                    )}
                    <Select
                        value={month}
                        onChange={handleMonthChange}
                        style={{ width: 120 }}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <Option key={i + 1} value={i + 1}>
                                Tháng {i + 1}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        value={year}
                        onChange={handleYearChange}
                        style={{ width: 120 }}
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = dayjs().year() - 2 + i;
                            return (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            );
                        })}
                    </Select>
                </div>

                {selectedEmployee && (
                    <Card title="Chi tiết lương">
                        <div className="mb-4">
                            <h3
                                className="text-2xl font-bold"
                                style={{
                                    color: '#3f8600',
                                    background: '#e6ffed',
                                    display: 'inline-block',
                                    padding: '8px 24px',
                                    borderRadius: '8px',
                                    marginBottom: 8,
                                }}
                            >
                                Tổng lương tháng: {salaryData?.totalSalary?.toLocaleString('vi-VN')} VNĐ
                            </h3>
                            <p>Số công việc: {salaryData?.jobs?.length || 0}</p>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={salaryData?.jobs || []}
                            loading={loading}
                            rowKey="jobId"
                            pagination={false}
                        />
                    </Card>
                )}
            </Card>
        </div>
    );
};

export default EmployeePayroll;