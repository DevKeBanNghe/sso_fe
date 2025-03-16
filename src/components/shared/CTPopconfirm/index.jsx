import { Popconfirm } from 'antd';

const CTPopconfirm = ({ children, title = 'CTPopconfirm', onConfirm, onCancel, ...props }) => {
  return (
    <Popconfirm title={title} onConfirm={onConfirm} onCancel={onCancel} okText='Yes' cancelText='No' {...props}>
      {children}
    </Popconfirm>
  );
};
export default CTPopconfirm;
