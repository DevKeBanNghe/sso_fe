import { Checkbox } from 'antd';
import { useMemo } from 'react';

function ToggleColumnsView({ list = [], value = [], onChange = () => {} }) {
  const options = useMemo(
    () =>
      list.map(({ key, title }) => ({
        label: title,
        value: key ?? title,
      })),
    [list],
  );

  return <Checkbox.Group value={value} options={options} onChange={onChange} style={{ margin: '10px 0' }} />;
}

export default ToggleColumnsView;
