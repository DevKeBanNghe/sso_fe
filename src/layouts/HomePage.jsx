import { useState } from 'react';
import { useOutlet } from 'react-router-dom';

import Header from './Header/Header';
import Footer from './Footer';
import { Layout } from 'antd';
const { Content } = Layout;
import { FloatButton } from 'antd';
const HomePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const outlet = useOutlet();

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
