import { Layout, Menu, Dropdown, Typography, Space, theme } from 'antd';
import { FlaskConical, LogOut, User, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const { Header, Content } = Layout;
const { Text } = Typography;

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { token: themeToken } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <FlaskConical size={16} />,
      label: 'Nova Análise',
    },
    {
      key: '/dashboard',
      icon: <BarChart3 size={16} />,
      label: 'Dashboard',
    },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Sair',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ height: '100%' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: themeToken.colorBgContainer,
          borderBottom: `1px solid ${themeToken.colorBorder}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <FlaskConical size={22} color="#2563EB" />
            <Text strong style={{ fontSize: 18 }}>QAmatic</Text>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', minWidth: 260 }}
          />
        </div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <User size={16} />
            <Text>{user?.name || 'Usuário'}</Text>
          </Space>
        </Dropdown>
      </Header>
      <Content style={{ overflow: 'auto' }}>
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout;
