import { Tabs } from 'antd';
import { genRouteNameDefault } from 'common/utils/route.util';
import useCurrentPage from 'hooks/useCurrentPage';
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
  const navigate = useNavigate();
  return <Tabs defaultActiveKey={currentRootRoute} items={items} onChange={(key) => navigate(key)} />;
};
export default TabHeader;
