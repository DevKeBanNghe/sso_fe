import { useNavigate, useOutlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer';
import { Layout } from 'antd';
import { FloatButton } from 'antd';
import useUser from 'hooks/useUser';
import useAuth from 'hooks/useAuth';
import useCurrentPage from 'hooks/useCurrentPage';
import { useEffect } from 'react';
import { LOADING_STATUS } from 'common/consts/constants.const';
const { Content } = Layout;

const HomePage = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const user = useUser();
  const { isAllowed } = useAuth();
  const { currentRoute, queryParamsString } = useCurrentPage({ isPaging: false });

  useEffect(() => {
    if (!user.user_name && user.loading === LOADING_STATUS.IDLE) return navigate(`/sign-in${queryParamsString}`);
    if (currentRoute === '/') return navigate(`/users${queryParamsString}`);
    if (!isAllowed)
      navigate('error/403', {
        state: {
          status_code: 403,
        },
      });
  }, [user, isAllowed, currentRoute]);

  return (
    <>
      <FloatButton.BackTop />
      <Layout hasSider>
        <Layout style={{ margin: '0 50px' }}>
          <Header style={{ background: '#737373' }} />
          <Content style={{ margin: '10px 0', overflow: 'initial' }}>
            <div
              style={{
                padding: 12,
                minHeight: '100vh',
              }}
            >
              {outlet}
            </div>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </>
  );
};

export default HomePage;
