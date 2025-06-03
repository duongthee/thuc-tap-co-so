import React from 'react';
import { Layout, Menu, Avatar, Button , message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate , useLocation } from 'react-router-dom';
import { logoutUser } from '../redux/authAction';
const { Header, Content, Sider } = Layout;
import { useState } from 'react';
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  SolutionOutlined,
  DollarOutlined,
  BarChartOutlined,
  ProfileOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login', { replace: true });
      message.success('Đăng xuất thành công!');
    });
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'toggle') {
      setCollapsed(prev => !prev);
      return;
    }

    // Chỉ cho phép xem bảng lương của chính mình
    if (user?.role === 'Staff' && key === '/payroll/employee') {
      navigate(`/payroll/employee/${user.employeeId._id}`);
      return;
    }

    navigate(key);
  };

  // Tạo menu items dựa trên role của user
  const getMenuItems = () => {
    const baseItems = [
      {
        key: 'toggle',
        icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
        label: collapsed ? 'Mở rộng' : 'Thu gọn',
      },
      {
        key: '/job/assign',
        icon: <CalendarOutlined />,
        label: 'Công việc',
      }
    ];

    // Menu items cho nhân sự
    const employeeItems = {
      key: 'employee',
      icon: <TeamOutlined />,
      label: 'Nhân sự',
      children: [
        {
          key: '/employee/infor',
          icon: <UserOutlined />,
          label: 'Thông tin cá nhân',
        }
      ]
    };

    // Menu items cho lương
    const payrollItems = {
      key: 'payroll',
      icon: <DollarOutlined />,
      label: 'Lương',
      children: [
        {
          key: '/payroll/employee',
          icon: <ProfileOutlined />,
          label: 'Lương chi tiết',
        }
      ]
    };

    // Nếu không phải Staff, thêm các menu items bổ sung
    if (user?.role !== 'Staff') {
      employeeItems.children.unshift({
        key: '/employee/list',
        icon: <SolutionOutlined />,
        label: 'Danh sách nhân viên',
      });

      payrollItems.children.unshift({
        key: '/payroll/list',
        icon: <BarChartOutlined />,
        label: 'Thống kê lương',
      });
    }

    return [...baseItems, employeeItems, payrollItems];
  };

  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };
  return (
    <Layout className="min-h-screen bg-gray-100"> {/* Thêm màu nền xám nhạt */}
  {/* Header */}
  <Header className="bg-[#001529] px-6 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <img
        src="/iconttcs.jpg"
        alt="TTCS Studio"
        className="h-12"
      />
      <div className="text-white text-xl font-semibold">TTCS Studio</div>
    </div>

    <div className="flex items-center gap-3">
      <Avatar
        icon={<UserOutlined />}
        style={{ backgroundColor: '#141414' }}
      />
      <span className="text-white">{user?.employeeId?.name}</span>
      <Button
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ef4444';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#dc2626';
        }}
      >
        Đăng xuất
      </Button>
    </div>
  </Header>

  {/* Body Layout */}
  <Layout>
    <Sider width={210} theme="dark" collapsible collapsed={collapsed} className="min-h-screen">
      <Menu
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        theme="dark"
        items={getMenuItems()}
        onClick={handleMenuClick}
      />
    </Sider>

    <Layout className="p-6">
      <Content
        className="bg-white rounded-xl shadow-md min-h-[280px]"
        style={{ padding: '16px' }} // Thêm padding trực tiếp
      >
        {children}
      </Content>
    </Layout>
  </Layout>
</Layout>
  );
};

export default MainLayout;

