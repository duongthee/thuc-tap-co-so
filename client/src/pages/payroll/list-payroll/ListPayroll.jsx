import React, { useState, useEffect } from 'react';
import { getTotalSalaryByMonth } from '../services/payroll.services';
import { Card, Select, Statistic, Row, Col, Table, message, Tag } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const ListPayroll = () => {
    const [loading, setLoading] = useState(false);
    const [salaryData, setSalaryData] = useState(null);
    const [month, setMonth] = useState(dayjs().month() + 1);
    const [year, setYear] = useState(dayjs().year());

    const fetchSalaryData = async () => {
        try {
            setLoading(true);
            const response = await getTotalSalaryByMonth(month, year);
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
        fetchSalaryData();
    }, [month, year]);

    const calculateTotalSalary = () => {
        if (!salaryData?.employees) return 0;
        return salaryData.employees.reduce((total, employee) => total + employee.totalSalary, 0);
    };

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
            title: 'Tên nhân viên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
            key: 'position',
            render: (position) => (
                <Tag color={getPositionColor(position)}>
                    {position}
                </Tag>
            ),
        },
        {
            title: 'Tổng lương',
            dataIndex: 'totalSalary',
            key: 'totalSalary',
            render: (salary) => `${salary.toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Số công việc',
            dataIndex: 'jobs',
            key: 'jobs',
            render: (jobs) => jobs.length,
        },
    ];

    const handleMonthChange = (value) => {
        setMonth(value);
    };

    const handleYearChange = (value) => {
        setYear(value);
    };

    return (
        <div className="p-6">
            <Card title="Báo cáo lương theo tháng" className="mb-4">
                <div className="flex gap-4 mb-6">
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

                <Row gutter={16} className="mb-6">
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng lương tháng"
                                value={calculateTotalSalary()}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                suffix="VNĐ"
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số nhân viên"
                                value={salaryData?.totalEmployees || 0}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số công việc"
                                value={salaryData?.employees?.reduce((total, emp) => total + emp.jobs.length, 0) || 0}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card title="Danh sách lương nhân viên">
                    <Table
                        columns={columns}
                        dataSource={salaryData?.employees || []}
                        loading={loading}
                        rowKey="employeeId"
                        pagination={false}
                    />
                </Card>
            </Card>
        </div>
    );
};

export default ListPayroll;