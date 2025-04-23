import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Space, message, Select, Row, Col, Input } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { getEmployee } from "./services/employee.service.js";
import { Tag } from "antd";
import debounce from "lodash.debounce";

const EmployeeTable = () => {
  const { Option } = Select;
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ["5", "10", "20"],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  });
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // Mặc định sắp xếp tăng dần
  const [searchName, setSearchName] = useState(""); // Lưu giá trị tìm kiếm

  const fetchEmployees = async (page = 1, pageSize = 10, filters = {}, sortBy = "name", sortOrder = "asc") => {
    setLoading(true);
    try {
      const { data, pagination: paginationData } = await getEmployee(page, pageSize, filters, sortBy, sortOrder);
      setEmployees(data);
      setPagination((prev) => ({
        ...prev,
        current: paginationData.currentPage,
        pageSize: paginationData.limit,
        total: paginationData.totalRecords,
      }));
    } catch (error) {
      message.error("Failed to fetch employees");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(pagination.current, pagination.pageSize, { name: searchName }, "name", sortOrder);
  }, [pagination.current, pagination.pageSize, searchName, sortOrder]);

  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    setPagination((prev) => ({
      ...prev,
      current,
      pageSize,
    }));

    if (sorter.field) {
      const sortBy = sorter.field;
      const sortOrder = sorter.order === "ascend" ? "asc" : "desc";
      setSortOrder(sortOrder); 
    }
  };

  const handleSortChange = (value) => {
    setSortOrder(value); 
  };

  const debounceSearch = useCallback(
    debounce((value) => {
      setSearchName(value); 
    }, 1000),
    []
  );

  const handleSearch = (e) => {
    debounceSearch(e.target.value); // Gọi debounce khi người dùng nhập
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      align: "center",
      key: "stt",
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      align: "center",
      key: "name",
      sorter: true, // Cho phép sắp xếp
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      align: "center",
      key: "gender",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      align: "center",
      key: "position",
      render: (position) => {
        let color;
        switch (position) {
          case "Admin":
            color = "red";
            break;
          case "Quản lý":
            color = "blue";
            break;
          case "Thu ngân":
            color = "green";
            break;
          case "Pha chế":
            color = "orange";
            break;
          case "Phục vụ":
            color = "purple";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{position}</Tag>;
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      align: "center",
      key: "dob",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            style={{
              backgroundColor: "#facc15", // Màu vàng tương ứng với bg-yellow-500
              color: "white", // Màu chữ
              border: "none", // Loại bỏ viền
              padding: "6px 12px", // Khoảng cách bên trong
              borderRadius: "4px", // Bo góc
              cursor: "pointer", // Con trỏ chuột
              transition: "background-color 0.3s ease", // Hiệu ứng hover
            }}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            style={{
              backgroundColor: "#ff4d4f", // Màu nền đỏ
              color: "white", // Màu chữ
              border: "none", // Loại bỏ viền
              padding: "6px 12px", // Khoảng cách bên trong
              borderRadius: "4px", // Bo góc
            }}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    message.info(`Xem thông tin nhân viên: ${record.name}`);
  };

  const handleEdit = (record) => {
    message.info(`Chỉnh sửa nhân viên: ${record.name}`);
  };

  const handleDelete = (record) => {
    message.success(`Đã xóa nhân viên: ${record.name}`);
  };

  return (
    <div className="p-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Input.Search placeholder="Tìm kiếm theo tên" allowClear onChange={handleSearch} style={{ width: 300 }} />
          <Button
            type="primary"
            onClick={() => message.info("Chức năng lọc đang được phát triển")}
            style={{ marginLeft: 10, width: 85 }}
            icon={<UnorderedListOutlined />}
          >
            Lọc
          </Button>
        </Col>
        <Col>
          <Select defaultValue="asc" style={{ width: 200 }} onChange={handleSortChange}>
            <Option value="asc">Sắp xếp tăng dần</Option>
            <Option value="desc">Sắp xếp giảm dần</Option>
          </Select>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={employees}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="_id"
        className="shadow-md rounded-lg"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default EmployeeTable;