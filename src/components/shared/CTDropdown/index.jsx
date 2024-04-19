import { Dropdown } from 'antd';

export default function CTDropdown({ items = [], children, ...props }) {
  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={['click']}
      {...props}>
      {children}
    </Dropdown>
  );
}
