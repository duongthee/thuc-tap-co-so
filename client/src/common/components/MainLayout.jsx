import React from 'react';
import { Layout, Menu, Avatar, Button , message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate , useLocation } from 'react-router-dom';
import { logoutUser } from '../redux/authAction';
const { Header, Content, Sider } = Layout;
import { useState } from 'react';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  SolutionOutlined,
  DollarOutlined,
  BarChartOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  OrderedListOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [collapsed, setCollapsed] = useState(false);
  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
        navigate('/login', { replace: true });
        message.success('Đăng xuất thành công!');
    });
  };
  const location = useLocation();
  const items = [
  {
    key: 'toggle',
    icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
    label: collapsed ? 'Mở rộng' : 'Thu gọn',
  },
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'schedule',
    icon: <CalendarOutlined />,
    label: 'Lịch',
    children: [
      {
        key: '/schedule/assign',
        icon: <ScheduleOutlined />,
        label: 'Đăng ký lịch',
      },
      {
        key: '/schedule/set',
        icon: <OrderedListOutlined />,
        label: 'Sắp xếp lịch',
      },
    ],
  },
  {
    key: 'employee',
    icon: <TeamOutlined />,
    label: 'Nhân sự',
    children: [
      {
        key: '/employee/list',
        icon: <SolutionOutlined />,
        label: 'Thống kê nhân sự',
      },
      {
        key: '/employee/infor',
        icon: <UserOutlined />,
        label: 'Thông tin cá nhân',
      },
    ],
  },
  {
    key: 'payroll',
    icon: <DollarOutlined />,
    label: 'Lương',
    children: [
      {
        key: '/payroll/list',
        icon: <BarChartOutlined />,
        label: 'Thống kê lương',
      },
      {
        key: '/payroll/employee',
        icon: <ProfileOutlined />,
        label: 'Lương chi tiết',
      },
    ],
  },
];

  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };
  return (
    <Layout className="min-h-screen">
      {/* Header */}
      <Header className="bg-[#001529] px-6 flex justify-between items-center  ">
        <div className="flex items-center gap-2"> 
            <img 
            src='/logo.png' 
            alt="TTCS CAFFE"
            className="h-12" 
            />
            <div className="text-white text-xl font-semibold">TTCS CAFFE</div>
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
            defaultSelectedKeys={['1']}
            theme="dark"
            items={items}
            onClick={({ key }) => {
              if (key === 'toggle') {
                toggleCollapsed();
              }
              else {
                navigate(key);
              }
            }}
          />
        </Sider>

        <Layout className="p-6">
          <Content className="bg-white p-6 rounded-xl shadow-md min-h-[280px]">
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

