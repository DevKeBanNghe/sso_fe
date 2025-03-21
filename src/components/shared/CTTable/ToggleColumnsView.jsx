import { Checkbox } from 'antd';
import { useEffect, useMemo } from 'react';

function ToggleColumnsView({
  isShowDefaultAction,
  table_rows = [],
  table_columns = [],
  columnsInfo,
  columnsShow,
  setColumnsShow,
}) {
  useEffect(() => {
    const firstRow = table_rows[0];
    const isEmptyColumnsShoww = columnsShow.length === (isShowDefaultAction ? 1 : 0);
    if (isEmptyColumnsShoww && firstRow) {
      const columnsInfoShow = Object.entries(columnsInfo).reduce((acc, [column, isShow]) => {
        if (isShow) acc[column] = true;
        return acc;
      }, {});
      const keysDefaultChecked = Object.keys(firstRow).filter((item) => !columnsInfoShow[item]);
      setColumnsShow((prev) => [...prev, ...keysDefaultChecked]);
    }
  }, [table_rows]);

  const columnsCheckbox = useMemo(
    () =>
      table_columns.map(({ key, title }) => ({
        label: title,
        value: key ?? title,
      })),
    [table_columns],
  );

  return (
    <Checkbox.Group
      value={columnsShow}
      options={columnsCheckbox}
      onChange={(value) => {
        setColumnsShow(value);
      }}
      style={{ margin: '10px 0' }}
    />
  );
}

export default ToggleColumnsView;
