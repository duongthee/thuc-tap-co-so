import React from 'react';
import { Layout, Menu, Avatar, Button , message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/authAction';
import logo from '../../../public/logo.png'; // Đường dẫn đến logo của bạn
const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
        navigate('/login', { replace: true });
        message.success('Đăng xuất thành công!');
    });
  };

  return (
    <Layout className="min-h-screen">
      {/* Header */}
      <Header className="bg-[#001529] px-6 flex justify-between items-center">
        <div className="flex items-center gap-2"> {/* Điều chỉnh khoảng cách giữa logo và text */}
            <img 
            src={logo} // Đường dẫn đến logo của bạn
            alt="TTCS CAFFE"
            className="h-12" // Bạn có thể điều chỉnh kích thước của logo tùy ý
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
        <Sider width={200} theme="dark" className="min-h-screen">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            theme="dark"
            items={[
              { key: '1', label: 'Dashboard' },
              { key: '2', label: 'Quản lý nhân viên' },
              { key: '3', label: 'Bảng lương' },
              { key: '4', label: 'Cài đặt' },
            ]}
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
