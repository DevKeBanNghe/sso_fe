import { Select } from 'antd';
import { getPlaceholderDefault } from 'common/utils/component.util';
const CTSelect = ({ defaultValue = [], onChange, options, optionRender, children, ...props }) => (
  <Select
    style={{
      width: '100%',
    }}
    placeholder={getPlaceholderDefault(props.name)}
    defaultValue={defaultValue}
    onChange={onChange}
    options={options}
    optionRender={optionRender}
    {...props}
  >
    {children}
  </Select>
);
export default CTSelect;
