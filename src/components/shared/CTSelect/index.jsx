import { Select } from 'antd';
const CTSelect = ({ placeholder, defaultValue = [], onChange, options, optionRender, ...props }) => (
  <Select
    style={{
      width: '100%',
    }}
    placeholder={placeholder}
    defaultValue={defaultValue}
    onChange={onChange}
    options={options}
    optionRender={optionRender}
    {...props}
  />
);
export default CTSelect;
