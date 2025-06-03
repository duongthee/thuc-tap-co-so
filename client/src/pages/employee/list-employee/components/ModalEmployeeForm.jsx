import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, InputNumber, message } from "antd";
import moment from "moment"; // Import moment

const { Option } = Select;

const ModalEmployeeForm = ({ visible, onClose, onSubmit, mode, employeeData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === 2 && employeeData) {
      // Nếu là chế độ sửa, điền dữ liệu vào form
      form.setFieldsValue({
        ...employeeData,
        dob: employeeData.dob ? moment(employeeData.dob) : null,
        startWork: employeeData.startWork ? moment(employeeData.startWork) : null,
      });
    } else {
      form.resetFields(); // Reset form nếu là chế độ thêm
    }
  }, [mode, employeeData, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Chuyển đổi moment objects thành ISO string trước khi gửi lên server
        const formattedValues = {
          ...values,
          dob: values.dob ? values.dob.toISOString() : null,
          startWork: values.startWork ? values.startWork.toISOString() : null,
        };
        form.resetFields(); // Reset form sau khi submit
        onSubmit(formattedValues); // Gửi dữ liệu đã format lên cha
      })
      .catch((info) => {
        message.error("Vui lòng kiểm tra lại các trường nhập liệu!");
      });
  };

  return (
    <Modal
      title={mode === 1 ? "Thêm nhân viên mới" : "Sửa thông tin nhân viên"}
      open={visible}
      onCancel={() => {
        form.resetFields(); // Reset form khi đóng modal
        onClose();
      }}
      onOk={handleOk}
      okText={mode === 1 ? "Thêm" : "Lưu"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>
        <Form.Item  
          label="Ngày sinh"
          name="dob"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label="Chức vụ"
          name="position"
          rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
        >
          <Select placeholder="Chọn chức vụ">
            <Option value="Admin">Admin</Option>
            <Option value="Quản lý">Quản lý</Option>
            <Option value="CamOp">CamOp</Option>
            <Option value="Photograper">Photographer</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Email liên hệ"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email liên hệ!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email liên hệ" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Ngày bắt đầu làm việc"
          name="startWork"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu làm việc!" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEmployeeForm;