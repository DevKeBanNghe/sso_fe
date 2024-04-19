import { Avatar, Badge, Space } from 'antd';
const CTAvartar = ({ icon, size = 24, badgetValue = 1, ...props }) => (
  <Space size={size}>
    <Badge count={badgetValue}>
      <Avatar icon={icon} {...props} />
    </Badge>
  </Space>
);
export default CTAvartar;
