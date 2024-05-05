import { Button } from 'antd';
const CTButton = ({ icon, onClick, content, ...props }) => (
  <Button onClick={onClick} icon={icon} {...props}>
    {content}
  </Button>
);
export default CTButton;
