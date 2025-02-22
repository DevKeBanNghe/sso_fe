import { Tabs } from 'antd';
import { genRouteNameDefault } from 'common/utils/route.util';
import useCurrentPage from 'hooks/useCurrentPage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routers } from 'routers';

const items = routers
  .filter((route) => route.is_tab)
  .map((route) => ({
    key: route.path,
    label: route.name ?? genRouteNameDefault(route.path),
  }));
const TabHeader = () => {
  const { currentRootRoute } = useCurrentPage({ isPaging: false });
  const [defaultKeyTab, setDefaultKeyTab] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setDefaultKeyTab(currentRootRoute);
  }, [currentRootRoute]);

  return <Tabs activeKey={defaultKeyTab} items={items} onChange={(key) => navigate(key)} />;
};
export default TabHeader;
