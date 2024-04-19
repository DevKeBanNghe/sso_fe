import { Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';

const items = [
  {
    key: '/learn-code',
    label: 'Learn code',
  },
  {
    key: '/life-code',
    label: 'Life code',
  },
];
const TabHeader = () => {
  const navigate = useNavigate();
  const onChange = (key) => {
    navigate(key);
  };
  return <Tabs defaultActiveKey='1' items={items} onChange={onChange} />;
};
export default TabHeader;
