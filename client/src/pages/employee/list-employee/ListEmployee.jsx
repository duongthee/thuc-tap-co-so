import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Space, message, Select, Row, Col, Input, Tag , Modal } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import { getEmployee, getEmployeeById , addEmployee , updateEmployee , deleteEmployee} from "./services/employee.service.js";
import ModalFilter from "./components/ModalFilter";
import ModalEmployee from "./components/ModalEmployee";
import debounce from "lodash.debounce";
import ModalEmployeeForm from "./components/ModalEmployeeForm";

const EmployeeTable = () => {
  const { Option } = Select;
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ["2", "5", "10"],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  });
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchName, setSearchName] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({ gender: "", position: "" });
  const [filterTags, setFilterTags] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEmployeeFormVisible, setIsEmployeeFormVisible] = useState(false);
  const [employeeFormMode, setEmployeeFormMode] = useState(1); // 1: Thêm, 2: Sửa
  const [editingEmployee, setEditingEmployee] = useState(null);
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
    if (trigger) {
      fetchEmployees(pagination.current, pagination.pageSize, { ...filters, name: searchName }, "name", sortOrder);
      setTrigger(false);
    }
  }, [trigger]);

  useEffect(() => {
    setTrigger(true);
  }, []);

  const handleViewEmployee = async (id) => {
    try {
      setLoading(true);
      const response = await getEmployeeById(id);
      setSelectedEmployee(response);
      setIsEmployeeModalVisible(true);
    } catch (error) {
      message.error("Không thể tải thông tin nhân viên");
    } finally {
      setLoading(false);
    }
  };
  const debounceSearch = useCallback(
    debounce((value) => {
      setSearchName(value); // Cập nhật trạng thái tìm kiếm
      setTrigger(true); // Kích hoạt useEffect để gọi API
    }, 500), // Trì hoãn 500ms
    []
  );
  
  const handleSearch = (e) => {
    const value = e.target.value; // Lấy giá trị từ ô tìm kiếm
    debounceSearch(value); // Gọi hàm debounce
  };

  const handleCloseEmployeeModal = () => {
    setIsEmployeeModalVisible(false);
    setSelectedEmployee(null);
  };

  const handleFilter = () => {
    setIsFilterModalVisible(true); // Hiển thị modal lọc
  };
  const handleSortChange = (value) => {
    setSortOrder(value); // Cập nhật trạng thái sắp xếp
    setTrigger(true); // Kích hoạt useEffect để gọi API
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
    }
  // Kích hoạt useEffect để gọi API
    setTrigger(true);
  };
  const handleFilterCancel = () => {
    setIsFilterModalVisible(false); // Đóng modal lọc
  };
  const handleFilterApply = (values) => {
    setFilters(values); // Cập nhật bộ lọc
    setIsFilterModalVisible(false); // Đóng modal lọc

    // Tạo danh sách tag từ các giá trị lọc
    const tags = [];
    if (values.gender) {
      tags.push({ key: "gender", label: `Giới tính: ${values.gender}` });
    }
    if (values.position) {
      tags.push({ key: "position", label: `Chức vụ: ${values.position}` });
    }
    setFilterTags(tags); // Cập nhật tag
    setTrigger(true); // Kích hoạt useEffect để gọi API
  };
  
  const handleRemoveTag = (key) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[key]; // Xóa bộ lọc tương ứng
    setFilters(updatedFilters); // Cập nhật bộ lọc
    // Cập nhật danh sách tag
    const updatedTags = filterTags.filter((tag) => tag.key !== key);
    setFilterTags(updatedTags);
    setTrigger(true); // Kích hoạt useEffect để gọi API
  };
  const handleOpenAddEmployeeModal = () => {
    setEmployeeFormMode(1); // Chế độ thêm
    setEditingEmployee(null); // Không có dữ liệu chỉnh sửa
    setIsEmployeeFormVisible(true);
  };

  const handleOpenEditEmployeeModal = (employee) => {
    setEmployeeFormMode(2); // Chế độ sửa
    setEditingEmployee(employee); // Gán dữ liệu nhân viên cần sửa
    setIsEmployeeFormVisible(true);
  };

  const handleCloseEmployeeFormModal = () => {
    setIsEmployeeFormVisible(false);
  };

  const handleSubmitEmployeeForm = async (employeeData) => {
    try {
      if (employeeFormMode === 1) {
        // Thêm nhân viên
        await addEmployee(employeeData); // Hàm `addEmployee` cần được định nghĩa trong `employee.service.js`
        message.success("Thêm nhân viên thành công!");
      } else {
        // Sửa nhân viên
        await updateEmployee(editingEmployee._id, employeeData); // Hàm `updateEmployee` cần được định nghĩa
        message.success("Cập nhật thông tin nhân viên thành công!");
      }
      setTrigger(true); // Kích hoạt useEffect để tải lại danh sách
      handleCloseEmployeeFormModal(); // Đóng modal
    } catch (error) {
      message.error("Không thể xử lý yêu cầu!");
    }
  };

  const handleDeleteEmployee = (employee) => {
  Modal.confirm({
    title: `Bạn có muốn xóa nhân viên ${employee.name}?`,
    content: "Hành động này không thể hoàn tác.",
    okText: "Xác nhận",
    cancelText: "Hủy",
    onOk: async () => {
      try {
        await deleteEmployee(employee._id); // Gọi API xóa nhân viên
        message.success(`Đã xóa nhân viên: ${employee.name}`);
        setTrigger(true); // Kích hoạt useEffect để tải lại danh sách
      } catch (error) {
        message.error("Không thể xóa nhân viên!");
      }
    },
  });
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
      sorter: true,
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
      title: "Số điện thoại",
      dataIndex: "phoneContact",
      align: "center",
      key: "phoneContact",
    },
    {
      title: "Chức năng",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewEmployee(record._id)}
          >
            Xem
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            style={{
              backgroundColor: "#facc15",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
              onClick={() => handleOpenEditEmployeeModal(record)}
            >
            Sửa
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
            }}
            onClick={() => handleDeleteEmployee(record)} // Gọi hàm xử lý xóa
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Row className="mb-4">
        {filterTags.map((tag) => (
          <Tag
            key={tag.key}
            closable
            onClose={() => handleRemoveTag(tag.key)}
          >
            {tag.label}
          </Tag>
        ))}
      </Row>
     <Row justify="space-between" align="middle" className="mb-4">
      <Col>
        <Input.Search placeholder="Tìm kiếm theo tên" allowClear onChange={handleSearch} style={{ width: 300 }} />
        <Button
          type="primary"
          onClick={handleFilter}
          style={{ marginLeft: 10, width: 85 }}
          icon={<FilterOutlined />}
        >
          Lọc
        </Button>
      </Col>
      <Col>
        <Select defaultValue="asc" style={{ width: 200 }} onChange={handleSortChange}>
          <Option value="asc">Sắp xếp tăng dần</Option>
          <Option value="desc">Sắp xếp giảm dần</Option>
          </Select>
           <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={handleOpenAddEmployeeModal}
          >
          Thêm nhân viên
        </Button>
      </Col>
    </Row>
      <Table
        columns={columns}
        dataSource={employees}
        pagination={{
          ...pagination,
          position: ["bottomCenter"],
        }}
        loading={loading}
        onChange={handleTableChange}
        rowKey="_id"
        className="shadow-md rounded-lg"
        scroll={{ x: "max-content" }}
      />
      <ModalFilter
        visible={isFilterModalVisible}
        onCancel={handleFilterCancel}
        onApply={handleFilterApply}
      />
      <ModalEmployee
        visible={isEmployeeModalVisible}
        onClose={handleCloseEmployeeModal}
        employee={selectedEmployee}
      />
      <ModalEmployeeForm
        visible={isEmployeeFormVisible}
        onClose={handleCloseEmployeeFormModal}
        onSubmit={handleSubmitEmployeeForm}
        mode={employeeFormMode}
        employeeData={editingEmployee}
      />
    </div>
  );
};

export default EmployeeTable;