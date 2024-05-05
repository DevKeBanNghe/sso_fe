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
  const { currentRootRoute } = useCurrentPage();
  const navigate = useNavigate();
  const onChange = (key) => {
    navigate(key);
  };
  return <Tabs defaultActiveKey={currentRootRoute} items={items} onChange={onChange} />;
};
export default TabHeader;
