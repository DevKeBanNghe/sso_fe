import { Flex, Layout, Typography, Col, Row, Image, Space } from 'antd';
import TabHeader from './TabHeader';
import SearchBar from './SearchBar';
const { Header: HeaderLayout } = Layout;
import Logo from 'images/logo.png';
import { useNavigate } from 'react-router-dom';
import useUser from 'hooks/useUser';
import CTAvartar from 'components/shared/CTAvartar';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import CTDropdown from 'components/shared/CTDropdown';
import { useMemo, useState } from 'react';
const { Link } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [userInfo, setUserInfo] = useState([
    {
      label: <a href='https://www.antgroup.com'>Profile</a>,
      key: '0',
    },
    {
      label: <a href='https://www.antgroup.com'>Settings</a>,
      key: '1',
    },
    {
      label: <a href='https://www.antgroup.com'>Logout</a>,
      key: '2',
    },
  ]);
  const [notifications, setNotifications] = useState([
    {
      label: <a href='https://www.antgroup.com'>1st menu item</a>,
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: '2rd menu item',
      key: '1',
    },
  ]);

  const notificationLength = useMemo(() => notifications.filter((noti) => noti.key).length, [notifications]);

  return (
    // <HeaderLayout
    //   style={{
    //     padding: 0,
    //     background: '#ccc',
    //     display: 'flex',
    //     alignItems: 'center',
    //     position: 'sticky',
    //     top: 0,
    //     zIndex: 1,
    //   }}>
    //   <Button
    //     type='text'
    //     icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    //     onClick={() => setCollapsed(!collapsed)}
    //     style={{
    //       fontSize: '16px',
    //       width: 64,
    //       height: 64,
    //     }}
    //   />

    //   <Breadcrumb />
    // </HeaderLayout>
    <>
      <div style={{ background: '#f5f5f5', position: 'sticky', top: 0, zIndex: 1 }}>
        <Image preview={false} style={{ cursor: 'pointer' }} width={100} src={Logo} onClick={() => navigate('/')} />
        <div style={{ float: 'right', paddingTop: '40px' }}>
          {user ? (
            <>
              <Flex gap={'15px'}>
                <CTDropdown items={notifications}>
                  <a onClick={(e) => e.preventDefault()}>
                    <CTAvartar badgetValue={notificationLength} icon={<BellOutlined />} />
                  </a>
                </CTDropdown>

                <CTDropdown items={userInfo}>
                  <a onClick={(e) => e.preventDefault()}>
                    <CTAvartar badgetValue={0} icon={<UserOutlined />} />
                  </a>
                </CTDropdown>
              </Flex>
            </>
          ) : (
            <>
              <Flex gap={'15px'}>
                <Link style={{ color: 'black', opacity: '0.7' }} onClick={() => navigate('/sign-in')}>
                  Sign in
                </Link>
                <Link style={{ color: 'black' }} onClick={() => navigate('/sign-up')}>
                  Sign up
                </Link>
              </Flex>
            </>
          )}
        </div>
        <h2 style={{ margin: '0' }}>Dev Kể Bạn Nghe</h2>
        <Row>
          <Col span={16}>
            <TabHeader />
          </Col>
          <Col span={8}>
            <SearchBar />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Header;
