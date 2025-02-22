import { Flex, Col, Row, Image } from 'antd';
import TabHeader from './TabHeader';
import Logo from 'images/logo.png';
import { useNavigate } from 'react-router-dom';
import useUser from 'hooks/useUser';
import { PERSONAL_BRAND } from 'common/consts/constants.const';
import Events from './Events';
import Sign from './Sign';
import useCurrentPage from 'hooks/useCurrentPage';

const UserMobile = () => {
  const user = useUser();
  return (
    <Col xs={8} md={0}>
      {user.user_name ? <Events /> : <Sign />}
    </Col>
  );
};

const UserDesktop = () => {
  const user = useUser();
  return (
    <Col xs={0} md={2}>
      {user.user_name ? <Events /> : <Sign />}
    </Col>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { setQueryParams } = useCurrentPage({ isPaging: false });
  const handleSearch = () => {
    setQueryParams((prev) => ({ ...prev, page: 1, search: '' }));
  };
  const handlePageReset = () => {
    navigate('/');
    handleSearch();
  };

  return (
    <Row
      style={{
        background: '#f5f5f5',
        position: 'sticky',
        top: 0,
        zIndex: 9,
        borderBottom: '1px solid #ccc',
      }}
      justify={'center'}
      align='middle'
    >
      <Col xs={3} md={1}>
        <Image preview={false} style={{ cursor: 'pointer' }} width={75} src={Logo} onClick={handlePageReset} />
      </Col>
      <Col xs={12} md={3}>
        <h2
          onClick={handlePageReset}
          style={{
            margin: '0',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {PERSONAL_BRAND}
        </h2>
      </Col>

      <Col xs={0} md={14}>
        <Flex align='center' justify='center'>
          <TabHeader />
        </Flex>
      </Col>

      <UserMobile />
      <Col xs={1} md={1}></Col>
      <UserDesktop />
    </Row>
  );
};

export default Header;
