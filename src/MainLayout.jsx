import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { LogoutOutlined, BookOutlined, DashboardOutlined } from '@ant-design/icons';
import axios from 'axios'; 

const { Header, Content } = Layout;

export default function MainLayout({ children, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
   
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    
    delete axios.defaults.headers.common['Authorization'];

    
    onLogout(); 
    
    
    navigate('/login', { replace: true });
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: '#001529',
        padding: '0 30px', 
        position: 'sticky', 
        top: 0,
        zIndex: 1000,
        width: '100%',
        height: '72px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '22px', 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0 
        }}>
          <BookOutlined style={{ marginRight: '12px' }} /> Bookstore Admin
        </div>

        <Menu 
          theme="dark" 
          mode="horizontal" 
          selectedKeys={[location.pathname]} 
          style={{ 
            flex: 1, 
            marginLeft: '20px', 
            marginRight: '20px', 
            fontSize: '16px',
            borderBottom: 'none',
            minWidth: 0, 
            display: 'flex',
            justifyContent: 'flex-start' 
          }}
        >
          <Menu.Item key="/books" icon={<BookOutlined />} onClick={() => navigate('/books')}>
            จัดการหนังสือ
          </Menu.Item>
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />} onClick={() => navigate('/dashboard')}>
            แดชบอร์ด
          </Menu.Item>
        </Menu>

        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          size="large" 
          style={{ flexShrink: 0 }}
        >
          Logout
        </Button>
      </Header>
      
      <Content style={{ 
        padding: '40px 60px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '40px', 
          minHeight: 'calc(100vh - 180px)', 
          borderRadius: '15px', 
          width: '100%',     
          maxWidth: '1600px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
}