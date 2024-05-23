import { Button } from 'antd';
const CTButton = ({ icon, onClick, children, ...props }) => (
  <Button onClick={onClick} icon={icon} {...props}>
    {children}
  </Button>
);
export default CTButton;
