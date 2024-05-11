import { useEffect, useState } from 'react';
import { useNavigate, useOutlet } from 'react-router-dom';

import Header from './Header/Header';
import Footer from './Footer';
import { Layout } from 'antd';
const { Content } = Layout;
import { FloatButton } from 'antd';
import useUser from 'hooks/useUser';
import { LOADING_STATUS } from 'common/consts/constants.const';
import useAuth from 'hooks/useAuth';
import useCurrentPage from 'hooks/useCurrentPage';
const HomePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const outlet = useOutlet();
  const navigate = useNavigate();
  const user = useUser();
  const { isAllowed } = useAuth();
  const { currentRoute, queryParamsString } = useCurrentPage({ isPaging: false });

  useEffect(() => {
    if (!user.user_name && user.loading === LOADING_STATUS.IDLE) navigate(`/sign-in${queryParamsString}`);
  }, [user]);

  useEffect(() => {
    if (!user.user_name || currentRoute === '/') return () => {};
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
          <Header style={{ background: '#737373' }} collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content style={{ margin: '10px 0', overflow: 'initial' }}>
            <div
              style={{
                padding: 12,
                minHeight: '100vh',
              }}>
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
