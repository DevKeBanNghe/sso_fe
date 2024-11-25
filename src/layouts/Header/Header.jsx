import { Flex, Typography, Col, Row, Image } from 'antd';
import TabHeader from './TabHeader';
import Logo from 'images/logo.png';
import { useNavigate } from 'react-router-dom';
import useUser from 'hooks/useUser';
import { UserOutlined } from '@ant-design/icons';
import CTAvartar from 'components/shared/CTAvartar';
import CTDropdown from 'components/shared/CTDropdown';
import { toast } from 'common/utils/toast.util';
import { logout } from 'pages/SignIn/service';
const { Link } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const user = useUser();

  const handleLogout = async () => {
    await logout();
    toast.success('Logout successfully');
    navigate('/sign-in');
  };

  const userInfo = [
    {
      label: <Link>Profile</Link>,
      key: '0',
    },
    {
      label: <Link>Settings</Link>,
      key: '1',
    },
    {
      label: <Link onClick={handleLogout}>Logout</Link>,
      key: '2',
    },
  ];

  return (
    <>
      <div style={{ background: '#f5f5f5', position: 'sticky', top: 0, zIndex: 9 }}>
        <Image preview={false} style={{ cursor: 'pointer' }} width={100} src={Logo} onClick={() => navigate('/')} />
        <div style={{ float: 'right', paddingTop: '40px' }}>
          {user ? (
            <>
              <Flex gap={'15px'}>
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
          {/* <Col span={8}>
            <SearchBar />
          </Col> */}
        </Row>
      </div>
    </>
  );
};

export default Header;
