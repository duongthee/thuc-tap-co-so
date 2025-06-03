import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  message,
  Popconfirm,
  InputNumber,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getJobs, getEmployees, createJob, updateJob, deleteJob } from '../services/job.services';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const AssignJob = () => {
  const [form] = Form.useForm();
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sortOrder, setSortOrder] = useState("asc");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchJobs(1, 10, {}, "dayStart", "asc");
    if (user?.role !== 'Staff') {
      fetchEmployees();
    }
  }, [user]);

  const fetchJobs = async (page = 1, pageSize = 10, filters = {}, sortBy = "dayStart", sortOrder = "asc") => {
    try {
      setLoading(true);
      const data = await getJobs(page, pageSize, filters, sortBy, sortOrder);
      
      // Nếu là Staff, chỉ lấy các công việc được phân công
      let filteredJobs = data;
      if (user?.role === 'Staff') {
        filteredJobs = data.filter(job => 
          job.employees?.some(emp => 
            emp.employeeId?._id === user.employeeId._id || 
            emp.employeeId === user.employeeId._id
          )
        );
      }

      const mapped = filteredJobs.map(job => ({
        ...job,
        name: job.jobName,
        description: job.note,
        assignee: job.employees && job.employees[0] && job.employees[0].employeeId?.name
          ? job.employees[0].employeeId.name
          : 'Chưa phân công',
        dayStart: job.dayStart,
        dayEnd: job.dayEnd,
        startTime: job.startTime,
        endTime: job.endTime,
        place: job.place,
      }));
      setJobs(mapped);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải danh sách công việc');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data.map(emp => ({
        value: emp._id,
        label: emp.name,
        position: emp.position
      })));
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải danh sách nhân viên');
    }
  };

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text, record) => {
        if (!record.employees || record.employees.length === 0) return 'Chưa phân công';
        return (
          <div>
            {record.employees.map((emp, index) => (
              <div key={emp.employeeId._id} style={{ marginBottom: index < record.employees.length - 1 ? '8px' : 0 }}>
                <div>{emp.employeeId.name}</div>
                <div style={{ color: '#666', fontSize: '12px' }}>{emp.employeeId.position}</div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      align: 'center',
      render: (text, record) => {
        if (!record.employees || record.employees.length === 0) return '';
        return (
          <div>
            {record.employees.map((emp, idx) => (
              <div key={emp.employeeId._id} style={{ marginBottom: idx < record.employees.length - 1 ? '8px' : 0 }}>
                {emp.salary ? `${Number(emp.salary).toLocaleString('vi-VN')} ₫` : ''}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'dayStart',
      key: 'dayStart',
      sorter: true,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '',
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'dayEnd',
      key: 'dayEnd',
      sorter: true,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '',
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Giờ bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Giờ kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (!status) return '';
        const statusColors = {
          'Chưa hoàn thành': 'orange',
          'Đã hoàn thành': 'green',
        };
        return (
          <span style={{ color: statusColors[status] || 'gray' }}>
            {status}
          </span>
        );
      },
    },
    // Chỉ hiển thị cột thao tác cho Admin và Manager
    ...(user?.role !== 'Staff' ? [{
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa công việc này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    }] : []),
  ];

  const handleAdd = () => {
    setEditingJob(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    form.setFieldsValue({
      ...job,
      dayStart: dayjs(job.dayStart),
      dayEnd: dayjs(job.dayEnd),
      employees: job.employees?.map(emp => ({
        employeeId: emp.employeeId?._id || emp.employeeId,
        salary: emp.salary
      })) || [{}],
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      message.success('Xóa công việc thành công');
      fetchJobs();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa công việc');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const jobData = {
        jobName: values.name,
        note: values.description,
        employees: values.employees,
        dayStart: values.dayStart.toISOString(),
        dayEnd: values.dayEnd.toISOString(),
        startTime: values.startTime,
        endTime: values.endTime,
        place: values.place,
        status: values.status,
      };
      console.log('Job data gửi lên:', jobData);
      if (editingJob) {
        await updateJob(editingJob._id, jobData);
        message.success('Cập nhật công việc thành công');
      } else {
        await createJob(jobData);
        message.success('Tạo công việc mới thành công');
      }
      setIsModalVisible(false);
      fetchJobs();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    // Cập nhật trạng thái phân trang
    setPagination((prev) => ({
      ...prev,
      current,
      pageSize,
    }));

    // Cập nhật trạng thái sắp xếp
    if (sorter.field) {
      const sortBy = sorter.field;
      const sortOrder = sorter.order === "ascend" ? "asc" : "desc";
      setSortOrder(sortOrder);
      // Gọi API với tham số sắp xếp
      fetchJobs(current, pageSize, {}, sortBy, sortOrder);
    } else {
      fetchJobs(current, pageSize, {}, "dayStart", "asc");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý công việc</h1>
        {user?.role !== 'Staff' && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm công việc mới
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={jobs}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {user?.role !== 'Staff' && (
        <Modal
          title={editingJob ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Tên công việc"
              rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.List name="employees">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'employeeId']}
                        rules={[{ required: true, message: 'Chọn nhân viên' }]}
                      >
                        <Select
                          options={employees}
                          placeholder="Chọn nhân viên"
                          style={{ width: 180 }}
                          optionLabelProp="label"
                          optionRender={option => (
                            <div>
                              <div>{option.data.label}</div>
                              <div style={{ color: '#666', fontSize: '12px' }}>{option.data.position}</div>
                            </div>
                          )}
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'salary']}
                        rules={[{ required: true, message: 'Nhập lương' }]}
                      >
                        <InputNumber
                          placeholder="Lương"
                          min={0}
                          style={{ width: 120 }}
                          formatter={value => value ? `${Number(value).toLocaleString('vi-VN')} ₫` : ''}
                          parser={value => value.replace(/[₫\s,.]/g, '')}
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button danger onClick={() => remove(field.name)}>
                          Xóa
                        </Button>
                      )}
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    Thêm nhân viên
                  </Button>
                </>
              )}
            </Form.List>

            <Form.Item
              name="dayStart"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="dayEnd"
              label="Ngày kết thúc"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="startTime"
              label="Giờ bắt đầu"
              rules={[
                { required: true, message: 'Vui lòng nhập giờ bắt đầu' },
                { pattern: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Định dạng giờ không hợp lệ (HH:mm)' }
              ]}
            >
              <Input placeholder="VD: 08:00" />
            </Form.Item>

            <Form.Item
              name="endTime"
              label="Giờ kết thúc"
              rules={[
                { required: true, message: 'Vui lòng nhập giờ kết thúc' },
                { pattern: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Định dạng giờ không hợp lệ (HH:mm)' }
              ]}
            >
              <Input placeholder="VD: 10:30" />
            </Form.Item>

            <Form.Item
              name="place"
              label="Địa điểm"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
            >
              <Input placeholder="Nhập địa điểm" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Select.Option value="Chưa hoàn thành">Chưa hoàn thành</Select.Option>
                <Select.Option value="Đã hoàn thành">Đã hoàn thành</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingJob ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default AssignJob; 