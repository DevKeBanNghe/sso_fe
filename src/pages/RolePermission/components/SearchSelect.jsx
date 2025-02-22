import { Select } from 'antd';
import { upperFirst } from 'lodash';
import { useMemo, useState } from 'react';
import { SEARCH_TYPES } from '../const';
const { Option } = Select;

const SearchAddonBefore = ({ onSelect }) => {
  const [options, setOptions] = useState(SEARCH_TYPES);

  const defaultOption = useMemo(() => options.find((item) => item.isDefault) ?? options[0], [options]);

  return (
    <Select defaultValue={defaultOption} onSelect={onSelect}>
      {options.map(({ value }) => (
        <Option key={value} value={value}>
          {upperFirst(value)}
        </Option>
      ))}
    </Select>
  );
};

export { SearchAddonBefore };
