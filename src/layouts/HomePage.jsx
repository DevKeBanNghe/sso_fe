import { useNavigate, useOutlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer';
import { Layout } from 'antd';
import { FloatButton } from 'antd';
import useUser from 'hooks/useUser';
import useAuth from 'hooks/useAuth';
import useCurrentPage from 'hooks/useCurrentPage';
import { useEffect } from 'react';
const { Content } = Layout;

const HomePage = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const user = useUser();
  const { isAllowed } = useAuth();
  const { currentRoute, queryParamsString } = useCurrentPage({ isPaging: false });

  useEffect(() => {
    if (user.loading) return () => {};
    if (!isAllowed) {
      if (!user.user_name)
        return () => {
          navigate(`/sign-in${queryParamsString}`);
        };
      return () => {
        navigate('error', {
          state: {
            status_code: 403,
          },
        });
      };
    }

    if (currentRoute === '/')
      return () => {
        navigate(`/users${queryParamsString}`);
      };
  }, [user, isAllowed, currentRoute]);

  return (
    <>
      <FloatButton.BackTop />
      <Layout hasSider>
        <Layout>
          <Header style={{ background: '#737373' }} />
          <Content style={{ margin: '20px 20px', overflow: 'initial' }}>
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
